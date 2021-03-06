//document variables
var myDocument = app.activeDocument
var firstPage = myDocument.pages[0]
var pageWidth = myDocument.documentPreferences.pageWidth
var pageHeight = myDocument.documentPreferences.pageHeight

var currentPage = firstPage
var rectangles = currentPage.rectangles
var textFrames = currentPage.textFrames

//margins
var startX = currentPage.marginPreferences.right
var startY = currentPage.marginPreferences.top

//product info
var urlBase = "" // link

//logo paths
var oleOleLogoPath = ''
var ctLogoPath = ''

//settings // this needs refactor
var qrSize = 25 
var labelSize = 5

var logoSizeY = 6
var logoSizeX = 10

var xOffset = 2
var yOffset = 6

var shiftX = qrSize + xOffset
var shiftY = qrSize + labelSize + yOffset

var col = 0
var rowHeight = labelSize + qrSize
var rowWidth = qrSize
var qrsCurrentRowWidth = 0;
var qrsCurrentRowHeight = 0;
var usableWidth = pageWidth - startX - startX
var usableHeight = pageHeight - startY - startY

var qrsMaxWidth = 0

//starting positions
var constPos = {
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

var pos = constPos

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

    if (qrsMaxHeight >= usableHeight) {
        qrsCurrentRowHeight = 0
        lastBound = [
            startPos.y1 - shiftY,
            startPos.x1 + (rowWidth + xOffset) * col,
            startPos.y2 - shiftY,
            startPos.x2 + (rowWidth + xOffset) * col,
        ]
    }

    return [
        lastBound[0] + shiftY,
        lastBound[1],
        lastBound[2] + shiftY,
        lastBound[3],
    ]

}

function calculateCol() {
    if (qrsMaxHeight >= usableHeight) {
        col++;
    }
}

function updateQRsWidth() {
    qrsCurrentRowWidth += shiftX
    qrsMaxWidth = qrsCurrentRowWidth + shiftX
}

function updateQRsHeight() {
    qrsCurrentRowHeight += shiftY
    qrsMaxHeight = qrsCurrentRowHeight + shiftY
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

function distributeStickers(option, logoPath) {
    var id = i + option 

    calculateCol()

    generateLabel(id, frameSettings.label)
    generateQR(id, frameSettings.qr)
    generateLogo(logoPath, frameSettings.logo)

    frameSettings.label.geometricBounds = calculateBounds(pos.label, frameSettings.label.geometricBounds)
    frameSettings.qr.geometricBounds = calculateBounds(pos.qr, frameSettings.qr.geometricBounds)
    frameSettings.logo.geometricBounds = calculateBounds(pos.logo, frameSettings.logo.geometricBounds)
}

var productsAmount = 10 // last number of qr code carefull with that! :)
for (var i = 1; i <= productsAmount; i++) {

    updateQRsHeight()
    distributeStickers("A", oleOleLogoPath)
    updateQRsHeight()
    distributeStickers("B", ctLogoPath)
    if (qrsMaxHeight >= usableHeight) {
        updateQRsWidth()
        qrsCurrentRowHeight = 0
        if (qrsMaxWidth >= usableWidth) {
            qrsCurrentRowWidth = 0
            col = 0
            currentPage = app.activeDocument.pages[currentPage.documentOffset+1]

            rectangles = currentPage.rectangles
            textFrames = currentPage.textFrames
            
            frameSettings.label.geometricBounds = [constPos.label.y1, constPos.label.x1, constPos.label.y2, constPos.label.x2]
            frameSettings.qr.geometricBounds = [constPos.qr.y1, constPos.qr.x1, constPos.qr.y2, constPos.qr.x2]
            frameSettings.logo.geometricBounds = [constPos.logo.y1, constPos.logo.x1, constPos.logo.y2, constPos.logo.x2]
        }
    }
}