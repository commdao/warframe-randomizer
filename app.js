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
];

// Element references
const roleCounter = document.getElementById('roleCounter');
const warframeCounter = document.getElementById('warframeCounter');
const tilesetCounter = document.getElementById('tilesetCounter');
const rollButton = document.getElementById('rollButton');
const resetButton = document.getElementById('resetButton'); // New reset button reference

// Dropdown containers
const roleDropdown = document.getElementById('roleDropdown');
const warframeDropdown = document.getElementById('warframeDropdown');
const tilesetDropdown = document.getElementById('tilesetDropdown');

// Animation settings
let animationActive = false;
let intervalIds = [];
const speed = 50;
const baseSpinDuration = 2000;
const shortSpinDuration = 1200; // Faster spin when we have manual selections

// Initialize dropdowns
function initializeDropdowns() {
    // Clear existing options
    roleDropdown.innerHTML = '<option value="">Select Role</option>';
    warframeDropdown.innerHTML = '<option value="">Select Warframe</option>';
    tilesetDropdown.innerHTML = '<option value="">Select Tileset</option>';
    
    // Populate role dropdown
    loadOuts.forEach(loadout => {
        const option = document.createElement('option');
        option.value = loadout.role;
        option.textContent = loadout.role;
        roleDropdown.appendChild(option);
    });

    // Populate warframe dropdown with all warframes initially
    const allWarframes = [...new Set(loadOuts.flatMap(loadout => loadout.warframes))];
    allWarframes.forEach(warframe => {
        const option = document.createElement('option');
        option.value = warframe;
        option.textContent = warframe;
        warframeDropdown.appendChild(option);
    });

    // Populate tileset dropdown with all tilesets initially
    const allTilesets = [...new Set(loadOuts.flatMap(loadout => loadout.tileset))];
    allTilesets.forEach(tileset => {
        const option = document.createElement('option');
        option.value = tileset;
        option.textContent = tileset;
        tilesetDropdown.appendChild(option);
    });

    // Event listeners for selection changes
    roleDropdown.addEventListener('change', handleRoleSelection);
    warframeDropdown.addEventListener('change', handleWarframeSelection);
    tilesetDropdown.addEventListener('change', handleTilesetSelection);
}

// Attach event listeners for buttons
function initializeButtons() {
    // Remove existing event listeners to prevent duplicates
    if (rollButton) {
        const newRollButton = rollButton.cloneNode(true);
        rollButton.parentNode.replaceChild(newRollButton, rollButton);
        newRollButton.addEventListener('click', rollLoadout);
    }
    
    if (resetButton) {
        const newResetButton = resetButton.cloneNode(true);
        resetButton.parentNode.replaceChild(newResetButton, resetButton);
        newResetButton.addEventListener('click', resetLoadout);
    }
}

// New function to reset the loadout
function resetLoadout() {
    // Clear counter displays
    roleCounter.innerText = '---';
    warframeCounter.innerText = '---';
    tilesetCounter.innerText = '---';
    
    // Reset dropdown selections
    roleDropdown.value = "";
    warframeDropdown.value = "";
    tilesetDropdown.value = "";
    
    // Reset dropdowns to initial state with all options
    initializeDropdowns();
    
    // Reinitialize button event listeners
    initializeButtons();
    
    // Add a quick animation to indicate reset
    addUpdateAnimation(roleCounter);
    addUpdateAnimation(warframeCounter);
    addUpdateAnimation(tilesetCounter);
}

// Handle role selection
function handleRoleSelection() {
    if (roleDropdown.value === "") return;
    
    // Update warframe dropdown options based on selected role
    const selectedRole = loadOuts.find(loadout => loadout.role === roleDropdown.value);
    updateWarframeDropdown(selectedRole.warframes);
    updateTilesetDropdown(selectedRole.tileset);
    
    // Set the role display
    roleCounter.innerText = roleDropdown.value;
    
    // Randomly roll the other sections
    rollLoadoutWithSelection('role', roleDropdown.value);
}

// Handle warframe selection
function handleWarframeSelection() {
    if (warframeDropdown.value === "") return;
    
    // Find matching roles that have this warframe
    const matchingRoles = loadOuts.filter(loadout => 
        loadout.warframes.includes(warframeDropdown.value)
    );
    
    // Set the warframe display
    warframeCounter.innerText = warframeDropdown.value;
    
    // If only one role matches, we must use it
    if (matchingRoles.length === 1) {
        const selectedRole = matchingRoles[0];
        roleCounter.innerText = selectedRole.role;
        roleDropdown.value = selectedRole.role;
        updateTilesetDropdown(selectedRole.tileset);
        
        // Roll only the tileset
        rollLoadoutWithSelection('warframe', warframeDropdown.value);
    } else {
        // Multiple roles could match, randomly select one
        const randomRoleIndex = Math.floor(Math.random() * matchingRoles.length);
        const selectedRole = matchingRoles[randomRoleIndex];
        roleCounter.innerText = selectedRole.role;
        roleDropdown.value = selectedRole.role;
        updateTilesetDropdown(selectedRole.tileset);
        
        // Roll the tileset
        rollLoadoutWithSelection('warframe', warframeDropdown.value);
    }
}

// Handle tileset selection
function handleTilesetSelection() {
    if (tilesetDropdown.value === "") return;
    
    // Find matching roles that have this tileset
    const matchingRoles = loadOuts.filter(loadout => 
        loadout.tileset.includes(tilesetDropdown.value)
    );
    
    // Set the tileset display
    tilesetCounter.innerText = tilesetDropdown.value;
    
    // If only one role matches, we must use it
    if (matchingRoles.length === 1) {
        const selectedRole = matchingRoles[0];
        roleCounter.innerText = selectedRole.role;
        roleDropdown.value = selectedRole.role;
        updateWarframeDropdown(selectedRole.warframes);
        
        // Roll only the warframe
        rollLoadoutWithSelection('tileset', tilesetDropdown.value);
    } else {
        // Multiple roles could match, randomly select one
        const randomRoleIndex = Math.floor(Math.random() * matchingRoles.length);
        const selectedRole = matchingRoles[randomRoleIndex];
        roleCounter.innerText = selectedRole.role;
        roleDropdown.value = selectedRole.role;
        updateWarframeDropdown(selectedRole.warframes);
        
        // Roll the warframe
        rollLoadoutWithSelection('tileset', tilesetDropdown.value);
    }
}

// Update the warframe dropdown based on available options
function updateWarframeDropdown(warframes) {
    // Clear current options
    warframeDropdown.innerHTML = '<option value="">Select Warframe</option>';
    
    // Add new options
    warframes.forEach(warframe => {
        const option = document.createElement('option');
        option.value = warframe;
        option.textContent = warframe;
        warframeDropdown.appendChild(option);
    });
}

// Update the tileset dropdown based on available options
function updateTilesetDropdown(tilesets) {
    // Clear current options
    tilesetDropdown.innerHTML = '<option value="">Select Tileset</option>';
    
    // Add new options
    tilesets.forEach(tileset => {
        const option = document.createElement('option');
        option.value = tileset;
        option.textContent = tileset;
        tilesetDropdown.appendChild(option);
    });
}

// Animation function
function addUpdateAnimation(element) {
    element.classList.add('updating');
    setTimeout(() => {
        element.classList.remove('updating');
    }, baseSpinDuration);
}

// Counter update function
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

// Roll with manual selection
async function rollLoadoutWithSelection(selectedType, selectedValue) {
    // Prevent multiple rolls at once
    if (animationActive) return;
    animationActive = true;
    
    // Disable button during animation
    rollButton.disabled = true;
    if (resetButton) resetButton.disabled = true;
    
    // Clear any running animations
    intervalIds.forEach(id => clearInterval(id));
    intervalIds = [];
    
    // Determine which sections need rolling
    let roleNeedsRoll = selectedType !== 'role';
    let warframeNeedsRoll = selectedType !== 'warframe';
    let tilesetNeedsRoll = selectedType !== 'tileset';
    
    // Find the selected role or determine from selected item
    let selectedRole;
    
    if (selectedType === 'role') {
        selectedRole = loadOuts.find(loadout => loadout.role === selectedValue);
    } else if (selectedType === 'warframe') {
        // Find roles containing this warframe
        const matchingRoles = loadOuts.filter(loadout => 
            loadout.warframes.includes(selectedValue)
        );
        selectedRole = matchingRoles[Math.floor(Math.random() * matchingRoles.length)];
    } else if (selectedType === 'tileset') {
        // Find roles containing this tileset
        const matchingRoles = loadOuts.filter(loadout => 
            loadout.tileset.includes(selectedValue)
        );
        selectedRole = matchingRoles[Math.floor(Math.random() * matchingRoles.length)];
    }
    
    // Add animation to sections that need rolling
    if (roleNeedsRoll) addUpdateAnimation(roleCounter);
    if (warframeNeedsRoll) addUpdateAnimation(warframeCounter);
    if (tilesetNeedsRoll) addUpdateAnimation(tilesetCounter);
    
    // Roll time is shorter since we have some selections already
    const spinDuration = shortSpinDuration;
    
    // Roll timing can be sequential for better UX
    const roleRevealTime = spinDuration;
    const warframeRevealTime = spinDuration + 300; // small delay
    const tilesetRevealTime = spinDuration + 600; // small delay
    
    // Perform the necessary rolls
    let rolePromise, warframePromise, tilesetPromise;
    
    if (roleNeedsRoll) {
        const roles = loadOuts.map(loadout => loadout.role);
        rolePromise = updateCounter(roleCounter, roles, 'Role', roleRevealTime);
    } else {
        rolePromise = Promise.resolve(selectedRole.role);
    }
    
    // Get the selected role (either from manual selection or random roll)
    const finalRole = await rolePromise;
    if (roleNeedsRoll) {
        selectedRole = loadOuts.find(loadout => loadout.role === finalRole);
        roleCounter.innerText = finalRole;
        roleDropdown.value = finalRole;
    }
    
    // Update the dropdowns to reflect the selected role
    if (roleNeedsRoll || selectedType === 'tileset') {
        updateWarframeDropdown(selectedRole.warframes);
    }
    if (roleNeedsRoll || selectedType === 'warframe') {
        updateTilesetDropdown(selectedRole.tileset);
    }
    
    // Roll warframe if needed
    if (warframeNeedsRoll) {
        warframePromise = updateCounter(
            warframeCounter,
            selectedRole.warframes,
            'Warframes',
            warframeRevealTime
        );
        
        const selectedWarframe = await warframePromise;
        warframeCounter.innerText = selectedWarframe;
        warframeDropdown.value = selectedWarframe;
    }
    
    // Roll tileset if needed
    if (tilesetNeedsRoll) {
        tilesetPromise = updateCounter(
            tilesetCounter,
            selectedRole.tileset,
            'Tilesets',
            tilesetRevealTime
        );
        
        const selectedTileset = await tilesetPromise;
        tilesetCounter.innerText = selectedTileset;
        tilesetDropdown.value = selectedTileset;
    }
    
    // Re-enable button and reset state
    rollButton.disabled = false;
    if (resetButton) resetButton.disabled = false;
    animationActive = false;
}

// Original random roll function
async function rollLoadout() {
    // Clear dropdown selections
    roleDropdown.value = "";
    warframeDropdown.value = "";
    tilesetDropdown.value = "";
    
    rollButton.disabled = true;
    if (resetButton) resetButton.disabled = true;
    
    intervalIds.forEach(id => clearInterval(id));
    intervalIds = [];
    animationActive = true;

    // Add glow animations at the start
    addUpdateAnimation(roleCounter);
    addUpdateAnimation(warframeCounter);
    addUpdateAnimation(tilesetCounter);

    const roleRevealTime = baseSpinDuration;
    const warframeRevealTime = baseSpinDuration + 1000; // 1 second delay
    const tilesetRevealTime = baseSpinDuration + 2000; // 2 second delay

    const rolePromise = updateCounter(
        roleCounter,
        loadOuts.map(loadout => loadout.role),
        'Role',
        roleRevealTime
    );

    const allWarframes = [...new Set(loadOuts.flatMap(loadout => loadout.warframes))];
    const allTilesets = [...new Set(loadOuts.flatMap(loadout => loadout.tileset))];

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
    roleDropdown.value = selectedRoleName;
    
    // Update dropdown options to match the selected role
    updateWarframeDropdown(selectedRole.warframes);
    updateTilesetDropdown(selectedRole.tileset);

    await warframePromise;
    const selectedWarframe = selectedRole.warframes[
        Math.floor(Math.random() * selectedRole.warframes.length)
    ];
    warframeCounter.innerText = selectedWarframe;
    warframeDropdown.value = selectedWarframe;

    await tilesetPromise;
    const selectedTileset = selectedRole.tileset[
        Math.floor(Math.random() * selectedRole.tileset.length)
    ];
    tilesetCounter.innerText = selectedTileset;
    tilesetDropdown.value = selectedTileset;

    rollButton.disabled = false;
    if (resetButton) resetButton.disabled = false;
    animationActive = false;
}

// Initialize dropdowns when the page loads
window.addEventListener('DOMContentLoaded', () => {
    initializeDropdowns();
    
    // Add reset button if it doesn't exist
    if (!resetButton && rollButton) {
        const newResetButton = document.createElement('button');
        newResetButton.id = 'resetButton';
        newResetButton.className = rollButton.className; // Copy styling from roll button
        newResetButton.textContent = 'Reset';
        
        // Insert after roll button
        rollButton.parentNode.insertBefore(newResetButton, rollButton.nextSibling);
    }
    
    // Initialize button event listeners
    initializeButtons();
});