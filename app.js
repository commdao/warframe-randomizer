const loadOuts = [
    {
        role: 'Farmer',
        warframes: ['Hydroid', 'Khora', 'Nekros', 'Atlas'],
        tileset: ['Ceres', 'Saturn', 'Void', 'Deimos']
    },
    {
        role: 'Support',
        warframes: ['Trinity', 'Citrine', 'Wisp', 'Qorvex', 'Dante', 'Jade'],
        tileset: ['Defense', 'Survival']
    },
    {
        role: 'Marksman',
        warframes: ['Yareli', 'Zephyr', 'Cyte-09', 'Harrow'],
        tileset: ['1999', 'Ascension', 'Mirror Defense']
    },
    {
        role: 'Gladiator',
        warframes: ['Excalibur', 'Excalibur Umbra','Wukong', 'Valkyr', 'Garuda'],
        tileset: ['Shrine Defense', 'Exterminate', 'Abyssal Zone']
    },
    {
        role: 'Spellcaster',
        warframes: ['Ember', 'Jade', 'Dagath', 'Saryn', 'Gyre', 'Nyx'],
        tileset: ['Plains of Eidelon', 'Cambion Drift', 'Orb Vallis']
    },
    {
        role: 'Tactician',
        warframes: ['Titania', 'Vauban', 'Equinox', 'Lavos', 'Rhino'],
        tileset: ['Capture', 'Rescue', 'Nightwave']
    }
]

const roleCounter = document.getElementById('roleCounter');
const warframeCounter = document.getElementById('warframeCounter');
const tilesetCounter = document.getElementById('tilesetCounter');
const rollButton = document.getElementById('rollButton');

let animationActive = false;
let intervalIds = [];

const speed = 50;
const baseSpinDuration = 2000;
const roleDelay = 0;
const warframeDelay = 1000;
const tilesetDelay = 2000;

function addUpdateAnimation(element) {
    element.classList.add('updating');
    setTimeout(() => {
        element.classList.remove('updating');
    }, baseSpinDuration); 
}

function updateCounter(counter, options, category, revealTime) {
    return new Promise(resolve => {
        let currentOptionIndex = 0;
        let intervalId;
        let startTime = Date.now();

        function update() {
            const currentTime = Date.now();
            const timeElapsed = currentTime - startTime;

            if (timeElapsed < revealTime) {
                counter.innerText = options[currentOptionIndex];
                currentOptionIndex = (currentOptionIndex + 1) % options.length;
                intervalId = setTimeout(update, speed);
                intervalIds.push(intervalId);
            } else {
                clearInterval(intervalId);
                const selectedOption = options[Math.floor(Math.random() * options.length)];
                counter.innerText = selectedOption;
                resolve(selectedOption);
            }
        }
        update();
    });
}

async function rollLoadout() {
    rollButton.disabled = true;
    intervalIds.forEach(id => clearInterval(id));
    intervalIds = [];

    addUpdateAnimation(roleCounter);
    addUpdateAnimation(warframeCounter);
    addUpdateAnimation(tilesetCounter); 

    const startTime = Date.now();

    const roleRevealTime = baseSpinDuration + roleDelay;
    const warframeRevealTime = baseSpinDuration + warframeDelay;
    const tilesetRevealTime = baseSpinDuration + tilesetDelay;

    const rolePromise = updateCounter(
        roleCounter,
        loadOuts.map(loadout => loadout.role),
        'Role',
        roleRevealTime
    );

    const allWarframes = loadOuts.flatMap(loadout => loadout.warframes);
    const allTilesets = loadOuts.flatMap(loadout => loadout.tileset);

    const warframePromise = updateCounter(
        warframeCounter,
        allWarframes,
        'Warframes',
        warframeRevealTime
    );

    const tilesetPromise = updateCounter(
        tilesetCounter,
        allTilesets,
        'Tilesets',
        tilesetRevealTime
    );

    const selectedRoleName = await rolePromise;
    const selectedRole = loadOuts.find(loadout => loadout.role === selectedRoleName);

    await warframePromise;
    const selectedWarframe = selectedRole.warframes[
        Math.floor(Math.random() * selectedRole.warframes.length)
    ];
    warframeCounter.innerText = selectedWarframe;

    await tilesetPromise;
    const selectedTileset = selectedRole.tileset[
        Math.floor(Math.random() * selectedRole.tileset.length)
    ];
    tilesetCounter.innerText = selectedTileset;

    rollButton.disabled = false;
}