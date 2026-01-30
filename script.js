// Global configs
const animalPositions = {
    cat: { left: '70%', top: '65%' },
    chicken: { left: '30%', top: '70%' },
    cow: { left: '45%', top: '40%' },
    dog: { left: '50%', top: '65%' },
    goat: { left: '25%', top: '40%' }
};

const sounds = {
    cat: 'audio/cat.wav',
    chicken: 'audio/chicken.wav',
    cow: 'audio/cow.wav',
    dog: 'audio/dog.wav',
    goat: 'audio/goat.wav'
};

document.addEventListener('DOMContentLoaded', function() {
    main();

    // STEP 1: Uncomment to make animals visible
    //showAnimals();

    // STEP 2: Uncomment for idle wiggle
    //addWiggle();

    // STEP 3: Uncomment for jump reaction on click
    //addJumpOnClick();
    // STEP 4: Uncomment for click to replay sound
    //addSoundOnClick();

    // STEP 5: Uncomment for naming animals on right-click
    //addNamingOnRightClick();

    // STEP 6: Uncomment for custom voice description on double-click
    //addVoiceOnDoubleClick();

    // STEP 7: Uncomment for drag and explore
    //addDrag();

    // STEP 8A: Uncomment for sound matching mini-game
    //addSoundGame();

    // STEP 8B: Uncomment for farm tour parade
    //addFarmTour();
});

// Function definitions for each step

function showAnimals() {
    Object.keys(animalPositions).forEach(function(animalId) {
        const animal = document.getElementById(animalId);
        if (animal) {
            animal.style.display = 'block';
        }
    });
}

function addWiggle() {
    Object.keys(animalPositions).forEach(function(animalId) {
        const animal = document.getElementById(animalId);
        if (animal) {
            animal.style.animation = 'idleWiggle 3s ease-in-out infinite';
        }
    });
}

function addSoundOnClick() {
    Object.keys(sounds).forEach(function(animalId) {
        const animal = document.getElementById(animalId);
        animal.addEventListener('click', function() {
            animal.clickTimeout = setTimeout(() => {
                const audio = new Audio(sounds[animalId]);
                audio.play().catch(function(error) {
                    console.log('Error playing sound for ' + animalId + ': ', error);
                });
            }, 500);
        });
    });
}

function addNamingOnRightClick() {
    const animalNames = JSON.parse(localStorage.getItem('animalNames')) || {};
    Object.keys(animalPositions).forEach(function(animalId) {
        const animal = document.getElementById(animalId);
        const label = animal.querySelector('.label');
        label.textContent = animalNames[animalId] || animalId.charAt(0).toUpperCase() + animalId.slice(1);
        animal.addEventListener('contextmenu', function(e) {
            e.preventDefault();
            const existingInput = animal.querySelector('.name-input');
            if (existingInput) return;
            const inputDiv = document.createElement('div');
            inputDiv.className = 'name-input';
            inputDiv.innerHTML = `
                <input type="text" placeholder="Name me!" maxlength="15" value="${animalNames[animalId] || ''}">
                <button>Submit</button>
            `;
            animal.appendChild(inputDiv);
            const input = inputDiv.querySelector('input');
            const button = inputDiv.querySelector('button');
            input.focus();
            button.addEventListener('click', () => {
                const name = input.value.trim();
                if (name) {
                    animalNames[animalId] = name;
                    localStorage.setItem('animalNames', JSON.stringify(animalNames));
                    label.textContent = name;
                }
                animal.removeChild(inputDiv);
            });
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') button.click();
            });
        });
    });
}

function addJumpOnClick() {
    Object.keys(sounds).forEach(function(animalId) {
        const animal = document.getElementById(animalId);
        animal.addEventListener('click', function() {
            animal.clickTimeout = setTimeout(() => {
                animal.classList.add('jumping');
                setTimeout(function() {
                    animal.classList.remove('jumping');
                }, 500);
            }, 300);
        });
    });
}

function addVoiceOnDoubleClick() {
    const voiceDescs = JSON.parse(localStorage.getItem('voiceDescs')) || {};
    let currentVoiceAnimal = null;
    const voiceModal = document.getElementById('voice-modal-overlay');
    const voiceInput = document.getElementById('voice-description-input');
    const voiceError = document.getElementById('voice-error');
    const saveVoiceButton = document.getElementById('save-voice');

    function showVoiceModal(animalId) {
        currentVoiceAnimal = animalId;
        voiceInput.value = voiceDescs[animalId] || '';
        voiceError.style.display = 'none';
        saveVoiceButton.disabled = !voiceInput.value.trim();
        voiceModal.style.display = 'flex';
        voiceInput.focus();
    }

    function hideVoiceModal() {
        voiceModal.style.display = 'none';
        currentVoiceAnimal = null;
    }

    voiceInput.addEventListener('input', function() {
        saveVoiceButton.disabled = !this.value.trim();
        voiceError.style.display = 'none';
    });

    saveVoiceButton.addEventListener('click', function() {
        const desc = voiceInput.value.trim();
        if (desc) {
            voiceDescs[currentVoiceAnimal] = desc;
            localStorage.setItem('voiceDescs', JSON.stringify(voiceDescs));
            hideVoiceModal();
            const tooltip = document.getElementById('tooltip-' + currentVoiceAnimal);
            tooltip.textContent = desc;
            tooltip.classList.add('active');
            setTimeout(function() {
                tooltip.classList.remove('active');
            }, 3000);
        } else {
            voiceError.style.display = 'block';
        }
    });

    voiceInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !saveVoiceButton.disabled) {
            saveVoiceButton.click();
        }
    });

    Object.keys(sounds).forEach(function(animalId) {
        const animal = document.getElementById(animalId);
        const tooltip = document.getElementById('tooltip-' + animalId);
        animal.addEventListener('click', function() {
        if (voiceDescs[animalId]) {
                tooltip.textContent = voiceDescs[animalId];
                tooltip.classList.add('active');
                setTimeout(function() {
                    tooltip.classList.remove('active');
                }, 3000);
            }

            
        });
        animal.addEventListener('dblclick', function() {
            if (animal.clickTimeout) clearTimeout(animal.clickTimeout);
            if (!voiceDescs[animalId]) {
                showVoiceModal(animalId);
            } 
        });
    });
}

function addDrag() {
    Object.keys(animalPositions).forEach(function(animalId) {
        const animal = document.getElementById(animalId);
        let isDragging = false;
        let offsetX, offsetY;
        animal.addEventListener('mousedown', function(e) {
            isDragging = true;
            offsetX = e.clientX - animal.offsetLeft;
            offsetY = e.clientY - animal.offsetTop;
            e.preventDefault();
        });
        document.addEventListener('mousemove', function(e) {
            if (isDragging) {
                animal.style.left = e.clientX - offsetX + 'px';
                animal.style.top = e.clientY - offsetY + 'px';
            }
        });
        document.addEventListener('mouseup', function() {
            isDragging = false;
        });
    });
}

function addSoundGame() {
    let gameScore = parseInt(localStorage.getItem('gameScore')) || 0;
    let currentMystery;
    const gameNotif = document.getElementById('game-notification');
    function showGameNotif(message, duration = 3000) {
        gameNotif.textContent = message;
        gameNotif.style.display = 'block';
        setTimeout(() => gameNotif.style.display = 'none', duration);
    }
    const gameButton = document.createElement('button');
    gameButton.textContent = 'Play Mystery Sound!';
    gameButton.style.position = 'absolute';
    gameButton.style.top = '10px';
    gameButton.style.right = '10px';
    gameButton.style.padding = '10px';
    gameButton.style.background = '#FF9800';
    gameButton.style.color = 'white';
    gameButton.style.border = 'none';
    gameButton.style.borderRadius = '5px';
    gameButton.style.cursor = 'pointer';
    document.body.appendChild(gameButton);
    gameButton.addEventListener('click', function() {
        const ids = Object.keys(sounds);
        currentMystery = ids[Math.floor(Math.random() * ids.length)];
        const audio = new Audio(sounds[currentMystery]);
        audio.play().catch(function(error) {
            console.log('Error playing mystery sound: ', error);
        });
        showGameNotif('Game started! Find the animal that made this sound!', 5000);
    });
    Object.keys(sounds).forEach(function(animalId) {
        const animal = document.getElementById(animalId);
        animal.addEventListener('click', function() {
            if (currentMystery) {
                if (currentMystery === animalId) {
                    gameScore++;
                    localStorage.setItem('gameScore', gameScore);
                    showGameNotif('Correct! Score: ' + gameScore);
                    currentMystery = null;
                } else {
                    showGameNotif('Wrong! Try again.');
                }
            }
        });
    });
}

function addFarmTour() {
    const tourButton = document.createElement('button');
    tourButton.textContent = 'Start Farm Tour!';
    tourButton.style.position = 'absolute';
    tourButton.style.top = '60px';
    tourButton.style.right = '10px';
    tourButton.style.padding = '10px';
    tourButton.style.background = '#2196F3';
    tourButton.style.color = 'white';
    tourButton.style.border = 'none';
    tourButton.style.borderRadius = '5px';
    tourButton.style.cursor = 'pointer';
    document.body.appendChild(tourButton);
    tourButton.addEventListener('click', function() {
        const ids = Object.keys(animalPositions);
        ids.forEach(function(id, index) {
            setTimeout(function() {
                const animal = document.getElementById(id);
                const tooltip = document.getElementById('tooltip-' + id);
                const voiceDesc = JSON.parse(localStorage.getItem('voiceDescs')) || {};
                tooltip.textContent = voiceDesc[id] || 'Sound!';
                tooltip.classList.add('active');
                setTimeout(function() {
                    tooltip.classList.remove('active');
                }, 2000);
                const audio = new Audio(sounds[id]);
                audio.play().catch(function(error) {
                    console.log('Error in tour: ', error);
                });
            }, index * 3000);
        });
    });
}

function main() {
    const nameInputDiv = document.getElementById('name-modal-overlay');
    const saveButton = document.getElementById('save-name');
    const nameInput = document.getElementById('garden-name-input');
    const savedName = localStorage.getItem('gardenName');
    if (savedName) {
        document.title = savedName + ' - Garden Zoo';
    } else {
        nameInputDiv.style.display = 'flex';
        nameInput.focus();
        const saveName = () => {
            const name = nameInput.value.trim();
            if (name) {
                localStorage.setItem('gardenName', name);
                document.title = name + ' - Garden Zoo';
                nameInputDiv.style.display = 'none';
            }
        };
        saveButton.addEventListener('click', saveName);
        nameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                saveName();
            }
        });
    }

    Object.keys(animalPositions).forEach(function(animalId) {
        const animal = document.getElementById(animalId);
        if (animal) {
            animal.style.display = 'none';
        }
    });

    Object.keys(animalPositions).forEach(function(animalId) {
        const animal = document.getElementById(animalId);
        if (animal) {
            animal.style.left = animalPositions[animalId].left;
            animal.style.top = animalPositions[animalId].top;
        }
    });
}