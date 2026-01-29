// Workshop Steps - Uncomment blocks below to unlock features progressively

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
    main()

    // STEP 1: Uncomment to make animals visible
    Object.keys(animalPositions).forEach(function(animalId) {
        const animal = document.getElementById(animalId);
        if (animal) {
            animal.style.display = 'block';
        }
    });

    // STEP 2: Uncomment for idle wiggle
    Object.keys(animalPositions).forEach(function(animalId) {
        const animal = document.getElementById(animalId);
        if (animal) {
            animal.style.animation = 'idleWiggle 3s ease-in-out infinite';
        }
    });

    // STEP 3: Uncomment for click to replay sound
    Object.keys(sounds).forEach(function(animalId) {
        const animal = document.getElementById(animalId);
        animal.addEventListener('click', function() {
            const audio = new Audio(sounds[animalId]);
            audio.play().catch(function(error) {
                console.log('Error playing sound for ' + animalId + ': ', error);
            });
        });
    });

    // STEP 4: Uncomment for naming animals on double-click
    const animalNames = JSON.parse(localStorage.getItem('animalNames')) || {};
    Object.keys(animalPositions).forEach(function(animalId) {
        const animal = document.getElementById(animalId);
        const label = animal.querySelector('.label');
        label.textContent = animalNames[animalId] || animalId.charAt(0).toUpperCase() + animalId.slice(1);
        animal.addEventListener('dblclick', function() {
            const existingInput = animal.querySelector('.name-input');
            if (existingInput) return; // Prevent multiple
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

    // STEP 5: Uncomment for jump reaction on click
    Object.keys(sounds).forEach(function(animalId) {
        const animal = document.getElementById(animalId);
        animal.addEventListener('click', function() {
            animal.classList.add('jumping');
            setTimeout(function() {
                animal.classList.remove('jumping');
            }, 500);
        });
    });

    // STEP 6: Uncomment for custom voice description tooltip
    const voiceDescs = JSON.parse(localStorage.getItem('voiceDescs')) || {};
    Object.keys(sounds).forEach(function(animalId) {
        const animal = document.getElementById(animalId);
        const tooltip = document.getElementById('tooltip-' + animalId);
        animal.addEventListener('click', function() {
            if (!voiceDescs[animalId]) {
                const desc = prompt('What does ' + animal.querySelector('.label').textContent + ' say? (e.g., "Meow!")');
                if (desc && desc.trim()) {
                    voiceDescs[animalId] = desc.trim();
                } else {
                    voiceDescs[animalId] = 'Sound!';
                }
                localStorage.setItem('voiceDescs', JSON.stringify(voiceDescs));
            }
            tooltip.textContent = voiceDescs[animalId];
            tooltip.classList.add('active');
            setTimeout(function() {
                tooltip.classList.remove('active');
            }, 3000);
        });
    });

    // STEP 7: Uncomment for drag and explore
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

    // STEP 8A: Uncomment for sound matching mini-game
    // let gameScore = parseInt(localStorage.getItem('gameScore')) || 0;
    // let currentMystery;
    // const gameButton = document.createElement('button');
    // gameButton.textContent = 'Play Mystery Sound!';
    // gameButton.style.position = 'absolute';
    // gameButton.style.top = '10px';
    // gameButton.style.right = '10px';
    // gameButton.style.padding = '10px';
    // gameButton.style.background = '#FF9800';
    // gameButton.style.color = 'white';
    // gameButton.style.border = 'none';
    // gameButton.style.borderRadius = '5px';
    // gameButton.style.cursor = 'pointer';
    // document.body.appendChild(gameButton);
    // gameButton.addEventListener('click', function() {
    //     const ids = Object.keys(sounds);
    //     currentMystery = ids[Math.floor(Math.random() * ids.length)];
    //     const audio = new Audio(sounds[currentMystery]);
    //     audio.play().catch(function(error) {
    //         console.log('Error playing mystery sound: ', error);
    //     });
    // });
    // Object.keys(sounds).forEach(function(animalId) {
    //     const animal = document.getElementById(animalId);
    //     animal.addEventListener('click', function() {
    //         if (currentMystery === animalId) {
    //             gameScore++;
    //             localStorage.setItem('gameScore', gameScore);
    //             alert('Correct! Score: ' + gameScore);
    //         } else {
    //             alert('Wrong! Try again.');
    //         }
    //     });
    // });

    // STEP 8B: Uncomment for farm tour parade
    // const tourButton = document.createElement('button');
    // tourButton.textContent = 'Start Farm Tour!';
    // tourButton.style.position = 'absolute';
    // tourButton.style.top = '60px';
    // tourButton.style.right = '10px';
    // tourButton.style.padding = '10px';
    // tourButton.style.background = '#2196F3';
    // tourButton.style.color = 'white';
    // tourButton.style.border = 'none';
    // tourButton.style.borderRadius = '5px';
    // tourButton.style.cursor = 'pointer';
    // document.body.appendChild(tourButton);
    // tourButton.addEventListener('click', function() {
    //     const ids = Object.keys(animalPositions);
    //     ids.forEach(function(id, index) {
    //         setTimeout(function() {
    //             const animal = document.getElementById(id);
    //             const tooltip = document.getElementById('tooltip-' + id);
    //             const voiceDesc = JSON.parse(localStorage.getItem('voiceDescs')) || {};
    //             tooltip.textContent = voiceDesc[id] || 'Sound!';
    //             tooltip.classList.add('active');
    //             setTimeout(function() {
    //                 tooltip.classList.remove('active');
    //             }, 2000);
    //             const audio = new Audio(sounds[id]);
    //             audio.play().catch(function(error) {
    //                 console.log('Error in tour: ', error);
    //             });
    //         }, index * 3000);
    //     });
    // });

});

// =====================================================================================
// ACTIVE CODE BELOW - Do not edit this section, it's for the app to run
// =====================================================================================

function main(){
    // Garden Name Input on Load
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



    // STEP 0: Empty forest - hide animals
    Object.keys(animalPositions).forEach(function(animalId) {
        const animal = document.getElementById(animalId);
        if (animal) {
            animal.style.display = 'none';
        }
    });

    // Apply positions (always)
    Object.keys(animalPositions).forEach(function(animalId) {
        const animal = document.getElementById(animalId);
        if (animal) {
            animal.style.left = animalPositions[animalId].left;
            animal.style.top = animalPositions[animalId].top;
        }
    });
}