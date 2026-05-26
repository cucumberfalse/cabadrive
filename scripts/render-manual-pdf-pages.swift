#!/usr/bin/env swift
import CoreGraphics
import Foundation
import ImageIO
import UniformTypeIdentifiers

struct RenderConfig {
  let pdfPath: String
  let outputDirectory: String
  let scale: CGFloat
  let quality: CGFloat
}

func usage() -> Never {
  fputs(
    """
    Usage:
      swift scripts/render-manual-pdf-pages.swift <source.pdf> <output-dir> [--scale 2] [--quality 0.9]

    Renders every PDF page to page-faithful JPEG assets named page-001.jpg, page-002.jpg, ...
    This is a generation helper; validation is handled by scripts/content-manual-vehiculo-4ruedas.mjs.

    """,
    stderr
  )
  exit(2)
}

func parseArguments(_ arguments: [String]) -> RenderConfig {
  if arguments.count < 3 {
    usage()
  }

  var scale = 2.0
  var quality = 0.9
  var index = 3
  while index < arguments.count {
    switch arguments[index] {
    case "--scale":
      guard index + 1 < arguments.count, let value = Double(arguments[index + 1]), value > 0 else {
        usage()
      }
      scale = value
      index += 2
    case "--quality":
      guard index + 1 < arguments.count, let value = Double(arguments[index + 1]), value > 0, value <= 1 else {
        usage()
      }
      quality = value
      index += 2
    default:
      usage()
    }
  }

  return RenderConfig(
    pdfPath: arguments[1],
    outputDirectory: arguments[2],
    scale: CGFloat(scale),
    quality: CGFloat(quality)
  )
}

func render(page: CGPDFPage, pageNumber: Int, outputURL: URL, scale: CGFloat, quality: CGFloat) throws -> (width: Int, height: Int) {
  let mediaBox = page.getBoxRect(.mediaBox)
  let width = Int((mediaBox.width * scale).rounded())
  let height = Int((mediaBox.height * scale).rounded())
  guard width > 0, height > 0 else {
    throw NSError(domain: "cabadrive.manual.render", code: 1, userInfo: [NSLocalizedDescriptionKey: "Invalid page dimensions"])
  }

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
    throw NSError(domain: "cabadrive.manual.render", code: 2, userInfo: [NSLocalizedDescriptionKey: "Could not create render context"])
  }

  context.setFillColor(CGColor(red: 1, green: 1, blue: 1, alpha: 1))
  context.fill(CGRect(x: 0, y: 0, width: width, height: height))
  context.saveGState()
  let targetRect = CGRect(x: 0, y: 0, width: CGFloat(width), height: CGFloat(height))
  context.concatenate(page.getDrawingTransform(.mediaBox, rect: targetRect, rotate: 0, preserveAspectRatio: true))
  context.drawPDFPage(page)
  context.restoreGState()

  guard let image = context.makeImage() else {
    throw NSError(domain: "cabadrive.manual.render", code: 3, userInfo: [NSLocalizedDescriptionKey: "Could not create page image"])
  }
  guard let destination = CGImageDestinationCreateWithURL(outputURL as CFURL, UTType.jpeg.identifier as CFString, 1, nil) else {
    throw NSError(domain: "cabadrive.manual.render", code: 4, userInfo: [NSLocalizedDescriptionKey: "Could not create image destination"])
  }
  let properties = [kCGImageDestinationLossyCompressionQuality as String: quality] as CFDictionary
  CGImageDestinationAddImage(destination, image, properties)
  guard CGImageDestinationFinalize(destination) else {
    throw NSError(domain: "cabadrive.manual.render", code: 5, userInfo: [NSLocalizedDescriptionKey: "Could not write image"])
  }
  return (width, height)
}

let config = parseArguments(CommandLine.arguments)
let pdfURL = URL(fileURLWithPath: config.pdfPath)
guard let document = CGPDFDocument(pdfURL as CFURL) else {
  fputs("Could not open PDF: \(config.pdfPath)\n", stderr)
  exit(1)
}

let outputURL = URL(fileURLWithPath: config.outputDirectory, isDirectory: true)
try FileManager.default.createDirectory(at: outputURL, withIntermediateDirectories: true)

for pageNumber in 1...document.numberOfPages {
  guard let page = document.page(at: pageNumber) else {
    fputs("Could not read page \(pageNumber)\n", stderr)
    exit(1)
  }
  let fileName = String(format: "page-%03d.jpg", pageNumber)
  let pageURL = outputURL.appendingPathComponent(fileName)
  do {
    let size = try render(page: page, pageNumber: pageNumber, outputURL: pageURL, scale: config.scale, quality: config.quality)
    print("\(fileName) \(size.width)x\(size.height)")
  } catch {
    fputs("Failed to render page \(pageNumber): \(error.localizedDescription)\n", stderr)
    exit(1)
  }
}
