#!/usr/bin/env swift
import CoreGraphics
import CryptoKit
import Foundation
import ImageIO
import UniformTypeIdentifiers

struct CropConfig: Codable {
  let sourcePdfPath: String
  let sourceBaseScale: Double
  let renderScale: Double
  let quality: Double
  let whiteThreshold: UInt8
  let paddingPxAtSourceBaseScale: Int
  let outputEvidencePath: String
  let targets: [CropTarget]
}

struct CropTarget: Codable {
  let sectionId: String
  let cardId: String
  let sourcePage: Int
  let currentAssetPath: String
  let outputAssetPath: String
  let outputSourceAssetPath: String
  let sourceRegionAtBaseScale: BoundsRecord?
  let sourceQualityDisposition: String?
}

struct SizeRecord: Codable {
  let width: Int
  let height: Int
}

struct BoundsRecord: Codable {
  let x: Int
  let y: Int
  let width: Int
  let height: Int
}

struct RatioRecord: Codable {
  let widthRatio: Double
  let heightRatio: Double
  let areaRatio: Double
}

struct CropEvidenceRecord: Codable {
  let sectionId: String
  let cardId: String
  let sourcePage: Int
  let currentAssetPath: String
  let outputAssetPath: String
  let outputSourceAssetPath: String
  let beforeDimensions: SizeRecord
  let beforeUsefulBounds: BoundsRecord
  let beforeUsefulRatios: RatioRecord
  let sourceRegionAtBaseScale: BoundsRecord
  let intermediateRenderDimensions: SizeRecord
  let intermediateUsefulBounds: BoundsRecord
  let renderedUsefulWidthScaleRatio: Double
  let sourceQualityDisposition: String
  let finalTrimBounds: BoundsRecord
  let outputDimensions: SizeRecord
  let outputUsefulBounds: BoundsRecord
  let outputUsefulRatios: RatioRecord
  let outputSha256: String
}

struct EvidenceDocument: Codable {
  let schemaVersion: Int
  let featureId: String
  let sourcePdfPath: String
  let sourceBaseScale: Double
  let renderScale: Double
  let quality: Double
  let whiteThreshold: UInt8
  let nonWhiteRule: String
  let paddingPxAtSourceBaseScale: Int
  let extractionMethod: String
  let targets: [CropEvidenceRecord]
}

func usage() -> Never {
  fputs(
    """
    Usage:
      swift scripts/manual-visual-content-crops.swift <config.json>

    Measures useful-content bounds from current manual visual assets, renders
    high-scale source-region crops from the official PDF, writes runtime/source
    crop assets, and records deterministic crop evidence.

    """,
    stderr
  )
  exit(2)
}

func loadJson<T: Decodable>(_ path: String, as type: T.Type) throws -> T {
  let data = try Data(contentsOf: URL(fileURLWithPath: path))
  let decoder = JSONDecoder()
  return try decoder.decode(type, from: data)
}

func writeJson<T: Encodable>(_ value: T, to path: String) throws {
  let encoder = JSONEncoder()
  encoder.outputFormatting = [.prettyPrinted, .sortedKeys, .withoutEscapingSlashes]
  let data = try encoder.encode(value)
  let url = URL(fileURLWithPath: path)
  try FileManager.default.createDirectory(at: url.deletingLastPathComponent(), withIntermediateDirectories: true)
  try data.write(to: url)
}

func ensureParentDirectory(_ path: String) throws {
  let url = URL(fileURLWithPath: path)
  try FileManager.default.createDirectory(at: url.deletingLastPathComponent(), withIntermediateDirectories: true)
}

func sha256Hex(_ data: Data) -> String {
  SHA256.hash(data: data).map { String(format: "%02x", $0) }.joined()
}

func loadImage(_ path: String) throws -> CGImage {
  let url = URL(fileURLWithPath: path)
  guard let source = CGImageSourceCreateWithURL(url as CFURL, nil),
        let image = CGImageSourceCreateImageAtIndex(source, 0, nil) else {
    throw NSError(domain: "cabadrive.manual.visual-crop", code: 1, userInfo: [NSLocalizedDescriptionKey: "Could not read image: \(path)"])
  }
  return image
}

func rgbaBytes(_ image: CGImage) throws -> (bytes: [UInt8], width: Int, height: Int, bytesPerRow: Int) {
  let width = image.width
  let height = image.height
  var bytes = [UInt8](repeating: 0, count: width * height * 4)
  let colorSpace = CGColorSpaceCreateDeviceRGB()
  guard let context = CGContext(
    data: &bytes,
    width: width,
    height: height,
    bitsPerComponent: 8,
    bytesPerRow: width * 4,
    space: colorSpace,
    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
  ) else {
    throw NSError(domain: "cabadrive.manual.visual-crop", code: 2, userInfo: [NSLocalizedDescriptionKey: "Could not create scan context"])
  }
  context.draw(image, in: CGRect(x: 0, y: 0, width: width, height: height))
  return (bytes, width, height, width * 4)
}

func measureUsefulBounds(_ image: CGImage, threshold: UInt8) throws -> BoundsRecord {
  let (bytes, width, height, bytesPerRow) = try rgbaBytes(image)
  var minX = width
  var minY = height
  var maxX = -1
  var maxY = -1

  for y in 0..<height {
    let row = y * bytesPerRow
    for x in 0..<width {
      let offset = row + x * 4
      let r = bytes[offset]
      let g = bytes[offset + 1]
      let b = bytes[offset + 2]
      let a = bytes[offset + 3]
      if a > 0 && (r < threshold || g < threshold || b < threshold) {
        minX = min(minX, x)
        minY = min(minY, y)
        maxX = max(maxX, x)
        maxY = max(maxY, y)
      }
    }
  }

  if maxX < minX || maxY < minY {
    return BoundsRecord(x: 0, y: 0, width: width, height: height)
  }
  return BoundsRecord(x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1)
}

func padded(_ bounds: BoundsRecord, padding: Int, imageWidth: Int, imageHeight: Int) -> BoundsRecord {
  let x = max(0, bounds.x - padding)
  let y = max(0, bounds.y - padding)
  let right = min(imageWidth, bounds.x + bounds.width + padding)
  let bottom = min(imageHeight, bounds.y + bounds.height + padding)
  return BoundsRecord(x: x, y: y, width: right - x, height: bottom - y)
}

func ratios(bounds: BoundsRecord, in size: SizeRecord) -> RatioRecord {
  let widthRatio = Double(bounds.width) / Double(size.width)
  let heightRatio = Double(bounds.height) / Double(size.height)
  let areaRatio = Double(bounds.width * bounds.height) / Double(size.width * size.height)
  return RatioRecord(widthRatio: widthRatio, heightRatio: heightRatio, areaRatio: areaRatio)
}

func renderFullPage(page: CGPDFPage, scale: CGFloat) throws -> CGImage {
  let mediaBox = page.getBoxRect(.mediaBox)
  let width = Int((mediaBox.width * scale).rounded())
  let height = Int((mediaBox.height * scale).rounded())
  let colorSpace = CGColorSpaceCreateDeviceRGB()
  guard let context = CGContext(
    data: nil,
    width: width,
    height: height,
    bitsPerComponent: 8,
    bytesPerRow: 0,
    space: colorSpace,
    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
  ) else {
    throw NSError(domain: "cabadrive.manual.visual-crop", code: 3, userInfo: [NSLocalizedDescriptionKey: "Could not create render context"])
  }

  context.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: 1))
  context.fill(CGRect(x: 0, y: 0, width: width, height: height))
  context.saveGState()
  let targetRect = CGRect(x: 0, y: 0, width: CGFloat(width), height: CGFloat(height))
  context.concatenate(page.getDrawingTransform(.mediaBox, rect: targetRect, rotate: 0, preserveAspectRatio: true))
  context.drawPDFPage(page)
  context.restoreGState()

  guard let image = context.makeImage() else {
    throw NSError(domain: "cabadrive.manual.visual-crop", code: 4, userInfo: [NSLocalizedDescriptionKey: "Could not create rendered image"])
  }
  return image
}

func jpegData(_ image: CGImage, quality: CGFloat) throws -> Data {
  let data = NSMutableData()
  guard let destination = CGImageDestinationCreateWithData(data, UTType.jpeg.identifier as CFString, 1, nil) else {
    throw NSError(domain: "cabadrive.manual.visual-crop", code: 5, userInfo: [NSLocalizedDescriptionKey: "Could not create JPEG destination"])
  }
  let properties = [kCGImageDestinationLossyCompressionQuality as String: quality] as CFDictionary
  CGImageDestinationAddImage(destination, image, properties)
  guard CGImageDestinationFinalize(destination) else {
    throw NSError(domain: "cabadrive.manual.visual-crop", code: 6, userInfo: [NSLocalizedDescriptionKey: "Could not encode JPEG"])
  }
  return data as Data
}

let arguments = CommandLine.arguments
guard arguments.count == 2 else {
  usage()
}

do {
  let config = try loadJson(arguments[1], as: CropConfig.self)
  let pdfURL = URL(fileURLWithPath: config.sourcePdfPath)
  guard let document = CGPDFDocument(pdfURL as CFURL) else {
    fputs("Could not open PDF: \(config.sourcePdfPath)\n", stderr)
    exit(1)
  }

  let scaleFactor = config.renderScale / config.sourceBaseScale
  var records: [CropEvidenceRecord] = []

  for target in config.targets {
    guard let page = document.page(at: target.sourcePage) else {
      throw NSError(domain: "cabadrive.manual.visual-crop", code: 7, userInfo: [NSLocalizedDescriptionKey: "Could not read PDF page \(target.sourcePage)"])
    }

    let currentImage = try loadImage(target.currentAssetPath)
    let beforeSize = SizeRecord(width: currentImage.width, height: currentImage.height)
    let beforeBounds = try measureUsefulBounds(currentImage, threshold: config.whiteThreshold)
    let cropBounds = target.sourceRegionAtBaseScale ?? padded(
      beforeBounds,
      padding: config.paddingPxAtSourceBaseScale,
      imageWidth: beforeSize.width,
      imageHeight: beforeSize.height
    )

    let renderedPage = try renderFullPage(page: page, scale: CGFloat(config.renderScale))
    let cropRect = CGRect(
      x: Double(cropBounds.x) * scaleFactor,
      y: Double(cropBounds.y) * scaleFactor,
      width: Double(cropBounds.width) * scaleFactor,
      height: Double(cropBounds.height) * scaleFactor
    ).integral
    guard let cropImage = renderedPage.cropping(to: cropRect) else {
      throw NSError(domain: "cabadrive.manual.visual-crop", code: 8, userInfo: [NSLocalizedDescriptionKey: "Could not crop rendered page \(target.sourcePage)"])
    }

    let intermediateSize = SizeRecord(width: cropImage.width, height: cropImage.height)
    let intermediateBounds = try measureUsefulBounds(cropImage, threshold: config.whiteThreshold)
    let renderedUsefulWidthScaleRatio = Double(intermediateBounds.width) / Double(beforeBounds.width)
    let expectedUsefulWidthScaleRatio = scaleFactor
    let explicitSourceRegion = target.sourceRegionAtBaseScale != nil
    let sourceLimited = !explicitSourceRegion && renderedUsefulWidthScaleRatio < expectedUsefulWidthScaleRatio * 0.75
    let outputPadding = sourceLimited
      ? config.paddingPxAtSourceBaseScale
      : Int((Double(config.paddingPxAtSourceBaseScale) * scaleFactor).rounded())
    let finalTrimBounds = padded(
      intermediateBounds,
      padding: outputPadding,
      imageWidth: intermediateSize.width,
      imageHeight: intermediateSize.height
    )
    let finalTrimRect = CGRect(
      x: finalTrimBounds.x,
      y: finalTrimBounds.y,
      width: finalTrimBounds.width,
      height: finalTrimBounds.height
    )
    guard let finalImage = cropImage.cropping(to: finalTrimRect) else {
      throw NSError(domain: "cabadrive.manual.visual-crop", code: 9, userInfo: [NSLocalizedDescriptionKey: "Could not trim rendered crop for page \(target.sourcePage)"])
    }

    let data = try jpegData(finalImage, quality: CGFloat(config.quality))
    try ensureParentDirectory(target.outputAssetPath)
    try ensureParentDirectory(target.outputSourceAssetPath)
    try data.write(to: URL(fileURLWithPath: target.outputAssetPath))
    try data.write(to: URL(fileURLWithPath: target.outputSourceAssetPath))

    let outputImage = try loadImage(target.outputAssetPath)
    let outputSize = SizeRecord(width: outputImage.width, height: outputImage.height)
    let outputBounds = try measureUsefulBounds(outputImage, threshold: config.whiteThreshold)
    let sha = sha256Hex(data)

    records.append(
      CropEvidenceRecord(
        sectionId: target.sectionId,
        cardId: target.cardId,
        sourcePage: target.sourcePage,
        currentAssetPath: target.currentAssetPath,
        outputAssetPath: target.outputAssetPath,
        outputSourceAssetPath: target.outputSourceAssetPath,
        beforeDimensions: beforeSize,
        beforeUsefulBounds: beforeBounds,
        beforeUsefulRatios: ratios(bounds: beforeBounds, in: beforeSize),
        sourceRegionAtBaseScale: cropBounds,
        intermediateRenderDimensions: intermediateSize,
        intermediateUsefulBounds: intermediateBounds,
        renderedUsefulWidthScaleRatio: renderedUsefulWidthScaleRatio,
        sourceQualityDisposition: target.sourceQualityDisposition ?? (sourceLimited
          ? "source-limited-native-raster-in-official-pdf; high-scale PDF render did not add useful sign pixels, so final crop trims the official raster without browser upscaling"
          : "high-scale-source-render-expanded-useful-content"),
        finalTrimBounds: finalTrimBounds,
        outputDimensions: outputSize,
        outputUsefulBounds: outputBounds,
        outputUsefulRatios: ratios(bounds: outputBounds, in: outputSize),
        outputSha256: sha
      )
    )

    print("\(target.cardId) page \(target.sourcePage): \(beforeBounds.width)x\(beforeBounds.height) -> \(outputSize.width)x\(outputSize.height)")
  }

  let evidence = EvidenceDocument(
    schemaVersion: 1,
    featureId: "034-manual-visual-content-crop",
    sourcePdfPath: config.sourcePdfPath,
    sourceBaseScale: config.sourceBaseScale,
    renderScale: config.renderScale,
    quality: config.quality,
    whiteThreshold: config.whiteThreshold,
    nonWhiteRule: "alpha > 0 and any RGB channel below threshold; refined from the initial all-channel wording so saturated sign colors are not missed",
    paddingPxAtSourceBaseScale: config.paddingPxAtSourceBaseScale,
    extractionMethod: "Source-region crops rendered from the official PDF at high scale, using useful-content bounds measured on the prior x5 page-sheet asset plus safety padding; no protected pixels are translated, redrawn, recolored, cleaned, retouched, masked, inpainted, or reconstructed.",
    targets: records
  )
  try writeJson(evidence, to: config.outputEvidencePath)
} catch {
  fputs("manual-visual-content-crops failed: \(error.localizedDescription)\n", stderr)
  exit(1)
}
