//document variables
var myDocument = app.documents.item(0)
var firstPage = myDocument.pages.item(0)
var pageWidth = myDocument.documentPreferences.pageWidth

var rectangles = firstPage.rectangles
var textFrames = firstPage.textFrames

//margins
var startX = firstPage.marginPreferences.right
var startY = firstPage.marginPreferences.top

//product info
var urlBase = "http://centrum-testow.pl/?id=" // link
var productsAmount = 20 // WARNING!

//logo paths
var oleOleLogoPath = 'C:/Users/Solidny Franciszek/Documents/QR-Code-Generator/QR-Code-Generator-InDesign/oleoleLogo_original.PNG'
var ctLogoPath = 'C:/Users/Solidny Franciszek/Documents/QR-Code-Generator/QR-Code-Generator-InDesign/CentrumTestowLogo.png'

//settings // this needs refactor
var qrSize = 25 
var labelSize = 5

var logoSizeY = 6
var logoSizeX = 10

var xOffset = 2
var yOffset = 6

var shiftX = qrSize + xOffset

var row = 0
var rowHeight = labelSize + qrSize
var qrsCurrentRowWidth = 0;
var usableWidth = pageWidth - startX - startX

//starting positions
var pos = {
    label: {
        y1: startY,
        x1: startX,
        y2: startY + labelSize,
        x2: startX + qrSize,
    },

    qr: {
        y1: startY + labelSize,
        x1: startX,
        y2: startY + qrSize,
        x2: startX + qrSize,
    },

    logo: {
        y1: startY + qrSize,
        x1: startX + logoSizeX,
        y2: startY + qrSize + logoSizeY,
        x2: startX + qrSize,
    },
}

//frames settings
var frameSettings = {
    label: {
        contentType: ContentType.TEXT_TYPE,
        geometricBounds: [pos.label.y1, pos.label.x1, pos.label.y2, pos.label.x2]
    },
    
    qr: {
        contentType: ContentType.GRAPHIC_TYPE,
        geometricBounds: [pos.qr.y1, pos.qr.x1, pos.qr.y2, pos.qr.x2]
    },

    logo: {
        contentType: ContentType.GRAPHIC_TYPE,
        geometricBounds: [pos.logo.y1, pos.logo.x1, pos.logo.y2, pos.logo.x2]
    },
}

function makeUrl(id) {
    return urlBase + id
}

function calculateBounds(startPos, lastBound) {

    if (qrsMaxWidth >= usableWidth) {
        qrsCurrentRowWidth = 0
        lastBound = [
            startPos.y1 + (rowHeight + yOffset) * row,
            startPos.x1 - shiftX,
            startPos.y2 + (rowHeight + yOffset) * row,
            startPos.x2 - shiftX,
        ]
    }

    return [
        lastBound[0],
        lastBound[1] + shiftX,
        lastBound[2],
        lastBound[3] + shiftX,
    ]

}

function calculateRow() {
    if (qrsMaxWidth >= usableWidth) {
        row++;
    }
}

function updateQRsWidth() {
    qrsCurrentRowWidth += shiftX
    qrsMaxWidth = qrsCurrentRowWidth + shiftX
}


function generateLabel(id, frameSettings) {
    var labelFrame = textFrames.add()
    labelFrame.geometricBounds = frameSettings.geometricBounds
    labelFrame.textFramePreferences.verticalJustification = VerticalJustification.TOP_ALIGN
    labelFrame.contents = id
}

function generateQR(id, frameSettings) {
    var qrFrame = rectangles.add(frameSettings)
    qrFrame.createHyperlinkQRCode(makeUrl(id))
    qrFrame.fit(FitOptions.FILL_PROPORTIONALLY)
    qrFrame.fillColor = "None"
    qrFrame.strokeWeight = "0"
}

function generateLogo(logo, frameSettings) {
    var logoFrame = rectangles.add(frameSettings)
    logoFrame.place(File(logo), false)
    logoFrame.fit(FitOptions.CONTENT_TO_FRAME);
    logoFrame.fit(FitOptions.PROPORTIONALLY);
    logoFrame.fit(FitOptions.CENTER_CONTENT);
    logoFrame.fillColor = "None"
    logoFrame.strokeWeight = "0"
}

function distributeStickers() {
    var logo = oleOleLogoPath
    var id
    for (var i = 1; i <= productsAmount; i++) {
        id = i + "A"
        
        updateQRsWidth()

        calculateRow()

        generateLabel(id, frameSettings.label)
        generateQR(id, frameSettings.qr)
        generateLogo(logo, frameSettings.logo)

        frameSettings.label.geometricBounds = calculateBounds(pos.label, frameSettings.label.geometricBounds)
        frameSettings.qr.geometricBounds = calculateBounds(pos.qr, frameSettings.qr.geometricBounds)
        frameSettings.logo.geometricBounds = calculateBounds(pos.logo, frameSettings.logo.geometricBounds)

        logo = ctLogoPath
        id = i + "B"
        
        updateQRsWidth()

        calculateRow()

        generateLabel(id, frameSettings.label)
        generateQR(id, frameSettings.qr)
        generateLogo(logo, frameSettings.logo)

        frameSettings.label.geometricBounds = calculateBounds(pos.label, frameSettings.label.geometricBounds)
        frameSettings.qr.geometricBounds = calculateBounds(pos.qr, frameSettings.qr.geometricBounds)
        frameSettings.logo.geometricBounds = calculateBounds(pos.logo, frameSettings.logo.geometricBounds)
    }
}

distributeStickers()