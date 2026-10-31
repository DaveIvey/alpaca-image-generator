const customizationOptions = {
    hair: [
        "default",
        "bang",
        "curls",
        "elegant",
        "fancy",
        "quiff",
        "short"
    ],

    ears: [
        "default",
        "tilt-backward",
        "tilt-forward"
    ],

    eyes: [
        "angry",
        "default",
        "naughty",
        "panda",
        "smart",
        "star"
    ],

    mouth: [
        "astonished",
        "default",
        "eating",
        "laugh",
        "tongue"
    ],

    neck: [
        "bend-backward",
        "bend-forward",
        "default",
        "thick"
    ],

    leg: [
        "bubble-tea",
        "cookie",
        "default",
        "game-console",
        "tilt-backward",
        "tilt-forward"
    ],

    accessory: [
        "earings",
        "flower",
        "glasses",
        "headphone"
    ],

    background: [
        "blue50",
        "blue60",
        "blue70",
        "darkblue30",
        "darkblue50",
        "darkblue70",
        "green50",
        "green60",
        "green70",
        "grey40",
        "grey70",
        "grey80",
        "red50",
        "red60",
        "red70",
        "yellow50",
        "yellow60",
        "yellow70"
    ]
};

const imageLayers = {
    hair: document.querySelector(".alpaca-hair"),
    ears: document.querySelector(".alpaca-ears"),
    eyes: document.querySelector(".alpaca-eyes"),
    mouth: document.querySelector(".alpaca-mouth"),
    neck: document.querySelector(".alpaca-neck"),
    leg: document.querySelector(".alpaca-leg"),
    accessory: document.querySelector(".alpaca-accessory"),
    background: document.querySelector(".alpaca-background")
};

const assetFolders = {
    hair: "hair",
    ears: "ears",
    eyes: "eyes",
    mouth: "mouth",
    neck: "neck",
    leg: "leg",
    accessory: "accessories",
    background: "backgrounds"
};

const alpaca = {
    hair: "default",
    ears: "default",
    eyes: "default",
    mouth: "default",
    neck: "default",
    leg: "default",
    accessory: "glasses",
    background: "blue50"
};

function selectFeature(category, style) {

    alpaca[category] = style;

    const folder = assetFolders[category];

    imageLayers[category].src =
        `alpaca-generator-assets/alpaca/${folder}/${style}.png`;

    console.log("Selected:", category, style);
}

const styleOptions = document.getElementById("style-options");

const categoryButtons = document.querySelectorAll(
    ".category-buttons button"
);

// Listen for category selections
categoryButtons.forEach(function(button) {

    button.addEventListener("click", function() {

        const category = button.dataset.category;

        renderOptions(category);

    });

});

function formatOptionLabel(style) {

    if (style === "earings") {
        return "Earrings";
    }

    return style
        .replace(/darkblue/gi, "dark blue")
        .replace(/([a-z])([0-9])/gi, "$1 $2")
        .replace(/-/g, " ")
        .replace(/\b\w/g, function(letter) {
            return letter.toUpperCase();
        });
}

let currentCategory = "hair";

renderOptions(currentCategory);

function renderOptions(category) {

    currentCategory = category;

    styleOptions.innerHTML = "";

    // Highlight the selected category
    categoryButtons.forEach(function(button) {

        button.classList.toggle(
            "active",
            button.dataset.category === category
        );

    });

    customizationOptions[category].forEach(function(style) {

        const button = document.createElement("button");

        button.type = "button";
        button.textContent = formatOptionLabel(style);

        // Highlight the currently selected style
        button.classList.toggle(
            "active",
            alpaca[category] === style
        );

        button.addEventListener("click", function() {

            selectFeature(category, style);

            renderOptions(category);

        });

        styleOptions.appendChild(button);

    });
}

function randomizeAlpaca() {

    Object.keys(customizationOptions).forEach(function(category) {

        const options = customizationOptions[category];

        const randomIndex = Math.floor(
            Math.random() * options.length
        );

        const randomStyle = options[randomIndex];

        selectFeature(category, randomStyle);

    });

    renderOptions(currentCategory);

}

const randomizeButton = document.getElementById("randomize-button");

randomizeButton.addEventListener("click", function() {
    randomizeAlpaca();
});


async function downloadAlpaca() {

    const canvas = document.createElement("canvas");

    canvas.width = 300;
    canvas.height = 300;

    const context = canvas.getContext("2d");

    const layers = [
        imageLayers.background,
        imageLayers.leg,
        imageLayers.neck,
        imageLayers.ears,
        imageLayers.hair,
        imageLayers.eyes,
        document.querySelector(".alpaca-nose"),
        imageLayers.mouth,
        imageLayers.accessory
    ];

    try {

        // Check that all image elements exist
        if (layers.some(image => !image)) {
            throw new Error("An image layer is missing.");
        }

        // Wait for all images to finish loading
        await Promise.all(
            layers.map(image => image.decode())
        );

        // Draw each image onto the canvas
        layers.forEach(function(image) {

            const scale = Math.min(
                canvas.width / image.naturalWidth,
                canvas.height / image.naturalHeight
            );

            const width = image.naturalWidth * scale;
            const height = image.naturalHeight * scale;

            const x = (canvas.width - width) / 2;
            const y = (canvas.height - height) / 2;

            context.drawImage(image, x, y, width, height);

        });

        const downloadLink = document.createElement("a");

        downloadLink.download = "my-alpaca.png";
        downloadLink.href = canvas.toDataURL("image/png");

        document.body.appendChild(downloadLink);
        downloadLink.click();
        downloadLink.remove();

    }
    catch (error) {

        console.error("Alpaca download failed:", error);

        alert("Sorry, your alpaca couldn't be downloaded. Please try again.");

    }

}

const downloadButton = document.getElementById("download-button");

downloadButton.addEventListener("click", function() {
    downloadAlpaca();
});