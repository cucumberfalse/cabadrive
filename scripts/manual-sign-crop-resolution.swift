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
  let outputEvidencePath: String
  let targets: [CropTarget]
}

struct CropTarget: Codable {
  let rowId: String
  let entryKind: String
  let sectionId: String
  let sourcePage: Int
  let sourceOrder: Int
  let outputAssetPath: String
  let candidateRegionAtBaseScale: BoundsRecord
  let baselineCropRegionAtCandidateScale: BoundsRecord
  let tailTrimMode: String
  let cardTrimBoundsAtCardRenderScale: BoundsRecord
  let cardRenderScale: Double
  let baselineCropNaturalWidth: Int
  let baselineCropNaturalHeight: Int
  let requiredMinimumWidth: Int
  let requiredMinimumHeight: Int
}

struct BoundsRecord: Codable {
  let x: Int
  let y: Int
  let width: Int
  let height: Int
}

struct SizeRecord: Codable {
  let width: Int
  let height: Int
}

struct PixelComponent {
  var minX: Int
  var minY: Int
  var maxX: Int
  var maxY: Int
  var area: Int

  var bounds: BoundsRecord {
    BoundsRecord(x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1)
  }
}

struct CropOutputRecord: Codable {
  let rowId: String
  let entryKind: String
  let sectionId: String
  let sourcePage: Int
  let sourceOrder: Int
  let sourcePdfPath: String
  let candidateRegionAtBaseScale: BoundsRecord
  let baselineCropRegionAtCandidateScale: BoundsRecord
  let sourceRegionAtBaseScale: BoundsRecord
  let contentTrimBoundsAtCandidateScale: BoundsRecord
  let tailTrimMode: String
  let cardTrimBoundsAtCardRenderScale: BoundsRecord
  let cardRenderScale: Double
  let cropRectAtRenderScale: BoundsRecord
  let selectedRenderScale: Double
  let outputAssetPath: String
  let outputDimensions: SizeRecord
  let outputSha256: String
  let baselineCropNaturalWidth: Int
  let baselineCropNaturalHeight: Int
  let requiredMinimumWidth: Int
  let requiredMinimumHeight: Int
  let outputPixelScaleRatioWidth: Double
  let outputPixelScaleRatioHeight: Double
  let outputPixelTargetRatioWidth: Double
  let outputPixelTargetRatioHeight: Double
  let renderMode: String
  let extractionMethod: String
  let sourceLimitedDisposition: String
}

struct CropOutputDocument: Codable {
  let schemaVersion: Int
  let featureId: String
  let sourcePdfPath: String
  let sourceBaseScale: Double
  let renderScale: Double
  let renderMode: String
  let extractionMethod: String
  let records: [CropOutputRecord]
}

func usage() -> Never {
  fputs(
    """
    Usage:
      swift scripts/manual-sign-crop-resolution.swift <config.json>

    Renders per-row Appendix IV sign crops directly from the retained official
    CABA manual PDF. The output is source-faithful 3x output pixels; source
    limitation/effective-detail disclosure is added by the Node evidence helper.

    """,
    stderr
  )
  exit(2)
}

func loadJson<T: Decodable>(_ path: String, as type: T.Type) throws -> T {
  let data = try Data(contentsOf: URL(fileURLWithPath: path))
  return try JSONDecoder().decode(type, from: data)
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

func pngData(_ image: CGImage) throws -> Data {
  let data = NSMutableData()
  guard let destination = CGImageDestinationCreateWithData(data, UTType.png.identifier as CFString, 1, nil) else {
    throw NSError(domain: "cabadrive.manual.sign-crop", code: 10, userInfo: [NSLocalizedDescriptionKey: "Could not create PNG destination"])
  }
  CGImageDestinationAddImage(destination, image, nil)
  guard CGImageDestinationFinalize(destination) else {
    throw NSError(domain: "cabadrive.manual.sign-crop", code: 11, userInfo: [NSLocalizedDescriptionKey: "Could not encode PNG"])
  }
  return data as Data
}

func renderFullPage(page: CGPDFPage, scale: Double) throws -> CGImage {
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
    throw NSError(domain: "cabadrive.manual.sign-crop", code: 12, userInfo: [NSLocalizedDescriptionKey: "Could not create render context"])
  }

  context.interpolationQuality = .high
  context.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: 1))
  context.fill(CGRect(x: 0, y: 0, width: width, height: height))
  context.saveGState()
  let targetRect = CGRect(x: 0, y: 0, width: CGFloat(width), height: CGFloat(height))
  context.concatenate(page.getDrawingTransform(.mediaBox, rect: targetRect, rotate: 0, preserveAspectRatio: true))
  context.drawPDFPage(page)
  context.restoreGState()

  guard let image = context.makeImage() else {
    throw NSError(domain: "cabadrive.manual.sign-crop", code: 13, userInfo: [NSLocalizedDescriptionKey: "Could not create rendered region image"])
  }
  return image
}

func scaleCrop(_ crop: CGImage, outputSize: SizeRecord) throws -> CGImage {
  let width = max(1, outputSize.width)
  let height = max(1, outputSize.height)
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
    throw NSError(domain: "cabadrive.manual.sign-crop", code: 16, userInfo: [NSLocalizedDescriptionKey: "Could not create output crop context"])
  }
  context.interpolationQuality = .high
  context.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: 1))
  context.fill(CGRect(x: 0, y: 0, width: width, height: height))
  let scale = min(Double(width) / Double(crop.width), Double(height) / Double(crop.height))
  let drawWidth = Double(crop.width) * scale
  let drawHeight = Double(crop.height) * scale
  let drawX = (Double(width) - drawWidth) / 2
  let drawY = (Double(height) - drawHeight) / 2
  context.draw(crop, in: CGRect(x: drawX, y: drawY, width: drawWidth, height: drawHeight))
  guard let image = context.makeImage() else {
    throw NSError(domain: "cabadrive.manual.sign-crop", code: 17, userInfo: [NSLocalizedDescriptionKey: "Could not create scaled crop image"])
  }
  return image
}

func clampBounds(_ bounds: BoundsRecord, width: Int, height: Int) -> BoundsRecord {
  let x = max(0, min(width - 1, bounds.x))
  let y = max(0, min(height - 1, bounds.y))
  let right = max(x + 1, min(width, bounds.x + bounds.width))
  let bottom = max(y + 1, min(height, bounds.y + bounds.height))
  return BoundsRecord(x: x, y: y, width: right - x, height: bottom - y)
}

func expandBounds(_ bounds: BoundsRecord, by padding: Int, width: Int, height: Int) -> BoundsRecord {
  return clampBounds(
    BoundsRecord(
      x: bounds.x - padding,
      y: bounds.y - padding,
      width: bounds.width + padding * 2,
      height: bounds.height + padding * 2
    ),
    width: width,
    height: height
  )
}

func expandBounds(_ bounds: BoundsRecord, xPadding: Int, yPadding: Int, width: Int, height: Int) -> BoundsRecord {
  return clampBounds(
    BoundsRecord(
      x: bounds.x - xPadding,
      y: bounds.y - yPadding,
      width: bounds.width + xPadding * 2,
      height: bounds.height + yPadding * 2
    ),
    width: width,
    height: height
  )
}

func boundsIntersect(_ left: BoundsRecord, _ right: BoundsRecord) -> Bool {
  return left.x < right.x + right.width &&
    left.x + left.width > right.x &&
    left.y < right.y + right.height &&
    left.y + left.height > right.y
}

func boundsCenterDistanceSquared(_ left: BoundsRecord, _ right: BoundsRecord) -> Double {
  let leftX = Double(left.x) + Double(left.width) / 2
  let leftY = Double(left.y) + Double(left.height) / 2
  let rightX = Double(right.x) + Double(right.width) / 2
  let rightY = Double(right.y) + Double(right.height) / 2
  let dx = leftX - rightX
  let dy = leftY - rightY
  return dx * dx + dy * dy
}

func pixelComponents(mask: [Bool], width: Int, height: Int) -> [PixelComponent] {
  var visited = [Bool](repeating: false, count: mask.count)
  var components: [PixelComponent] = []
  let neighborOffsets = [(-1, 0), (1, 0), (0, -1), (0, 1), (-1, -1), (1, -1), (-1, 1), (1, 1)]

  for index in 0..<mask.count {
    if visited[index] || !mask[index] {
      continue
    }

    var stack = [index]
    visited[index] = true
    var minX = index % width
    var maxX = minX
    var minY = index / width
    var maxY = minY
    var area = 0

    while let current = stack.popLast() {
      let x = current % width
      let y = current / width
      area += 1
      minX = min(minX, x)
      maxX = max(maxX, x)
      minY = min(minY, y)
      maxY = max(maxY, y)

      for (dx, dy) in neighborOffsets {
        let nextX = x + dx
        let nextY = y + dy
        if nextX < 0 || nextX >= width || nextY < 0 || nextY >= height {
          continue
        }
        let next = nextY * width + nextX
        if visited[next] || !mask[next] {
          continue
        }
        visited[next] = true
        stack.append(next)
      }
    }

    components.append(PixelComponent(minX: minX, minY: minY, maxX: maxX, maxY: maxY, area: area))
  }

  return components
}

func mergeComponentBounds(_ components: [PixelComponent]) -> BoundsRecord? {
  guard let first = components.first else {
    return nil
  }
  var minX = first.minX
  var minY = first.minY
  var maxX = first.maxX
  var maxY = first.maxY
  for component in components.dropFirst() {
    minX = min(minX, component.minX)
    minY = min(minY, component.minY)
    maxX = max(maxX, component.maxX)
    maxY = max(maxY, component.maxY)
  }
  return BoundsRecord(x: minX, y: minY, width: maxX - minX + 1, height: maxY - minY + 1)
}

func selectComponentBounds(_ components: [PixelComponent], anchorRect: BoundsRecord) -> BoundsRecord? {
  if components.isEmpty {
    return nil
  }

  let intersecting = components.filter { boundsIntersect($0.bounds, anchorRect) }
  if !intersecting.isEmpty {
    return mergeComponentBounds(intersecting)
  }

  let nearest = components.min { left, right in
    let leftDistance = boundsCenterDistanceSquared(left.bounds, anchorRect)
    let rightDistance = boundsCenterDistanceSquared(right.bounds, anchorRect)
    if leftDistance == rightDistance {
      return left.area > right.area
    }
    return leftDistance < rightDistance
  }
  return nearest?.bounds
}

func paddedTrimBounds(_ bounds: BoundsRecord, padding: Int, width: Int, height: Int) -> BoundsRecord {
  return expandBounds(bounds, by: padding, width: width, height: height)
}

func meaningfulContentBounds(_ image: CGImage, tailTrimMode: String, anchorRect: BoundsRecord) throws -> BoundsRecord {
  let width = image.width
  let height = image.height
  let bytesPerPixel = 4
  let bytesPerRow = width * bytesPerPixel
  var pixels = [UInt8](repeating: 255, count: bytesPerRow * height)
  let colorSpace = CGColorSpaceCreateDeviceRGB()
  guard let context = CGContext(
    data: &pixels,
    width: width,
    height: height,
    bitsPerComponent: 8,
    bytesPerRow: bytesPerRow,
    space: colorSpace,
    bitmapInfo: CGImageAlphaInfo.premultipliedLast.rawValue
  ) else {
    throw NSError(domain: "cabadrive.manual.sign-crop", code: 20, userInfo: [NSLocalizedDescriptionKey: "Could not create pixel inspection context"])
  }
  context.interpolationQuality = .none
  context.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: 1))
  context.fill(CGRect(x: 0, y: 0, width: width, height: height))
  context.draw(image, in: CGRect(x: 0, y: 0, width: width, height: height))

  var meaningfulMask = [Bool](repeating: false, count: width * height)
  var colorMask = [Bool](repeating: false, count: width * height)
  var totalMeaningful = 0
  var totalColorful = 0

  for y in 0..<height {
    for x in 0..<width {
      let offset = y * bytesPerRow + x * bytesPerPixel
      let red = pixels[offset]
      let green = pixels[offset + 1]
      let blue = pixels[offset + 2]
      let alpha = pixels[offset + 3]
      let isMeaningful = alpha > 8 && (red < 245 || green < 245 || blue < 245)
      if isMeaningful {
        let maskIndex = y * width + x
        meaningfulMask[maskIndex] = true
        totalMeaningful += 1
        let channelMax = max(Int(red), max(Int(green), Int(blue)))
        let channelMin = min(Int(red), min(Int(green), Int(blue)))
        if channelMax > channelMin + 30 {
          colorMask[maskIndex] = true
          totalColorful += 1
        }
      }
    }
  }

  if totalMeaningful == 0 {
    return BoundsRecord(x: 0, y: 0, width: width, height: height)
  }

  let padding = tailTrimMode == "preserve-colorless-lower-attachment" ? 5 : 6
  let anchor = expandBounds(clampBounds(anchorRect, width: width, height: height), by: 6, width: width, height: height)
  let meaningfulComponents = pixelComponents(mask: meaningfulMask, width: width, height: height)
  let meaningfulBounds = selectComponentBounds(meaningfulComponents, anchorRect: anchor)

  if tailTrimMode != "preserve-colorless-lower-attachment" && totalColorful > 30 {
    let colorComponents = pixelComponents(mask: colorMask, width: width, height: height)
    if let colorBounds = selectComponentBounds(colorComponents, anchorRect: anchor) {
      let minimumUsefulWidth = max(14, Int((Double(anchor.width) * 0.38).rounded()))
      let minimumUsefulHeight = max(14, Int((Double(anchor.height) * 0.28).rounded()))
      if colorBounds.width >= minimumUsefulWidth && colorBounds.height >= minimumUsefulHeight {
        return paddedTrimBounds(colorBounds, padding: padding, width: width, height: height)
      }
      let focusXPadding = max(24, anchor.width / 2)
      let focusYPadding = max(14, min(22, anchor.height / 5))
      let focusedAnchor = expandBounds(
        colorBounds,
        xPadding: focusXPadding,
        yPadding: focusYPadding,
        width: width,
        height: height
      )
      let focusedMeaningfulComponents = meaningfulComponents.filter { boundsIntersect($0.bounds, focusedAnchor) }
      if let focusedMeaningfulBounds = mergeComponentBounds(focusedMeaningfulComponents) {
        return paddedTrimBounds(focusedMeaningfulBounds, padding: padding, width: width, height: height)
      }
    }
  }

  if let meaningfulBounds = meaningfulBounds {
    return paddedTrimBounds(meaningfulBounds, padding: padding, width: width, height: height)
  }

  return BoundsRecord(x: 0, y: 0, width: width, height: height)
}

func ratio(_ numerator: Int, _ denominator: Int) -> Double {
  guard denominator > 0 else { return 0 }
  return (Double(numerator) / Double(denominator) * 1_000_000).rounded() / 1_000_000
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

  var records: [CropOutputRecord] = []
  var currentPageNumber = -1
  var currentPageImage: CGImage? = nil
  for target in config.targets {
    if currentPageNumber != target.sourcePage {
      guard let page = document.page(at: target.sourcePage) else {
        throw NSError(domain: "cabadrive.manual.sign-crop", code: 14, userInfo: [NSLocalizedDescriptionKey: "Could not read PDF page \(target.sourcePage)"])
      }
      currentPageImage = try renderFullPage(page: page, scale: config.sourceBaseScale)
      currentPageNumber = target.sourcePage
    }
    guard let pageImage = currentPageImage else {
      throw NSError(domain: "cabadrive.manual.sign-crop", code: 18, userInfo: [NSLocalizedDescriptionKey: "Missing rendered page \(target.sourcePage)"])
    }
    let candidateRect = CGRect(
      x: target.candidateRegionAtBaseScale.x,
      y: target.candidateRegionAtBaseScale.y,
      width: target.candidateRegionAtBaseScale.width,
      height: target.candidateRegionAtBaseScale.height
    )
    guard let candidateCrop = pageImage.cropping(to: candidateRect) else {
      throw NSError(domain: "cabadrive.manual.sign-crop", code: 19, userInfo: [NSLocalizedDescriptionKey: "Could not crop rendered page for \(target.rowId)"])
    }
    let contentTrim = try meaningfulContentBounds(
      candidateCrop,
      tailTrimMode: target.tailTrimMode,
      anchorRect: target.baselineCropRegionAtCandidateScale
    )
    let sourceRegion = BoundsRecord(
      x: target.candidateRegionAtBaseScale.x + contentTrim.x,
      y: target.candidateRegionAtBaseScale.y + contentTrim.y,
      width: contentTrim.width,
      height: contentTrim.height
    )
    let sourceRect = CGRect(x: contentTrim.x, y: contentTrim.y, width: contentTrim.width, height: contentTrim.height)
    guard let sourceCrop = candidateCrop.cropping(to: sourceRect) else {
      throw NSError(domain: "cabadrive.manual.sign-crop", code: 21, userInfo: [NSLocalizedDescriptionKey: "Could not trim rendered crop for \(target.rowId)"])
    }
    let image = try scaleCrop(sourceCrop, outputSize: SizeRecord(width: target.requiredMinimumWidth, height: target.requiredMinimumHeight))
    let data = try pngData(image)
    try ensureParentDirectory(target.outputAssetPath)
    try data.write(to: URL(fileURLWithPath: target.outputAssetPath))

    let outputSize = SizeRecord(width: image.width, height: image.height)
    if outputSize.width < target.requiredMinimumWidth || outputSize.height < target.requiredMinimumHeight {
      throw NSError(
        domain: "cabadrive.manual.sign-crop",
        code: 15,
        userInfo: [
          NSLocalizedDescriptionKey:
            "\(target.rowId) rendered \(outputSize.width)x\(outputSize.height), below required \(target.requiredMinimumWidth)x\(target.requiredMinimumHeight)"
        ]
      )
    }

    records.append(
      CropOutputRecord(
        rowId: target.rowId,
        entryKind: target.entryKind,
        sectionId: target.sectionId,
        sourcePage: target.sourcePage,
        sourceOrder: target.sourceOrder,
        sourcePdfPath: config.sourcePdfPath,
        candidateRegionAtBaseScale: target.candidateRegionAtBaseScale,
        baselineCropRegionAtCandidateScale: target.baselineCropRegionAtCandidateScale,
        sourceRegionAtBaseScale: sourceRegion,
        contentTrimBoundsAtCandidateScale: contentTrim,
        tailTrimMode: target.tailTrimMode,
        cardTrimBoundsAtCardRenderScale: target.cardTrimBoundsAtCardRenderScale,
        cardRenderScale: target.cardRenderScale,
        cropRectAtRenderScale: sourceRegion,
        selectedRenderScale: config.renderScale,
        outputAssetPath: target.outputAssetPath,
        outputDimensions: outputSize,
        outputSha256: sha256Hex(data),
        baselineCropNaturalWidth: target.baselineCropNaturalWidth,
        baselineCropNaturalHeight: target.baselineCropNaturalHeight,
        requiredMinimumWidth: target.requiredMinimumWidth,
        requiredMinimumHeight: target.requiredMinimumHeight,
        outputPixelScaleRatioWidth: ratio(outputSize.width, target.baselineCropNaturalWidth),
        outputPixelScaleRatioHeight: ratio(outputSize.height, target.baselineCropNaturalHeight),
        outputPixelTargetRatioWidth: ratio(outputSize.width, target.requiredMinimumWidth),
        outputPixelTargetRatioHeight: ratio(outputSize.height, target.requiredMinimumHeight),
        renderMode: "individual-source-crop-3x",
        extractionMethod:
          "fresh-official-pdf-full-page-render-scale-5-row-candidate-crop-content-trim-aspect-fit-to-3x-output-pixels-source-limited; protected pixels are rendered/cropped and aspect-fit inside a white 3x PNG canvas only, with no cleanup, sharpening, redraw, OCR, translation, recolor, vectorization, mask, retouch, stretch, or inpaint",
        sourceLimitedDisposition: "best-official-source-3x-output-pixels"
      )
    )

    print("\(target.rowId): \(outputSize.width)x\(outputSize.height)")
  }

  let output = CropOutputDocument(
    schemaVersion: 1,
    featureId: "037-manual-sign-crop-resolution",
    sourcePdfPath: config.sourcePdfPath,
    sourceBaseScale: config.sourceBaseScale,
    renderScale: config.renderScale,
    renderMode: "individual-source-crop-3x",
    extractionMethod:
      "Per-row source-faithful crops rendered from fresh scale-5 full-page renders of the retained official CABA manual PDF. Row crop coordinates start from feature-036 sourceRegion + cropRegion geometry, are constrained by neighboring table rows/columns, trimmed to non-white official source pixels, and then aspect-fit into a white 3x output-pixel PNG canvas without stretching protected pixels. Output files satisfy 3x pixel dimensions but remain source-limited exceptions for native/effective detail.",
    records: records
  )
  try writeJson(output, to: config.outputEvidencePath)
} catch {
  fputs("manual-sign-crop-resolution failed: \(error.localizedDescription)\n", stderr)
  exit(1)
}
