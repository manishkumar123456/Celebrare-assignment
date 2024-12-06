// script.js


const textInput = document.getElementById('text-input');
const fontSelect = document.getElementById('font-select');
const fontSizeDisplay = document.getElementById('font-size');
const fontSizeSlider = document.getElementById('font-size-slider');
const addTextButton = document.getElementById('add-text');
const boldButton = document.getElementById('bold');
const italicButton = document.getElementById('italic');
const colorSwatches = document.querySelectorAll('.color-swatch');

let activeSlide = 0;
let selectedText = null;

// Initialize Swiper with custom configuration
document.addEventListener('DOMContentLoaded', () => {
  const swiper = new Swiper('.swiper', {
    loop: true, 
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    allowTouchMove: false,
    simulateTouch: false,
    on: {
      slideChange: function () {
        activeSlide = this.activeIndex;
        selectedText = null;
      }
    }
  });
});

// Add text functionality
addTextButton.addEventListener('click', () => {
  if (textInput.value.trim() === '') return;
  
  const slides = document.querySelectorAll('.swiper-slide');
  const currentSlide = slides[activeSlide];
  
  // Create new text element
  const newText = document.createElement('span');
  newText.textContent = textInput.value;
  newText.classList.add('draggable-text');
  newText.style.position = 'absolute';
  newText.style.fontSize = `${fontSizeSlider.value}px`;
  newText.style.left = '50%';
  newText.style.top = '50%';
  newText.style.transform = 'translate(-50%, -50%)';
  newText.style.cursor = 'move';
  newText.style.userSelect = 'none';
  
  // Add click event to select text
  newText.addEventListener('click', selectText);
  
  // Enable dragging for the new text
  newText.addEventListener('mousedown', startDragging);
  
  currentSlide.appendChild(newText);
  
  // Clear text input
  textInput.value = '';
});

// Select text for editing
function selectText(e) {
  // Remove highlight from previous selected text
  if (selectedText) {
    selectedText.style.outline = 'none';
  }
  
  // Highlight the newly selected text
  selectedText = e.target;
  selectedText.style.outline = '2px solid blue';
  
  // Update font size slider and display to match selected text
  const currentSize = window.getComputedStyle(selectedText).fontSize;
  fontSizeSlider.value = parseInt(currentSize);
  fontSizeDisplay.textContent = `${parseInt(currentSize)}px`;
}

// Dragging functionality
function startDragging(e) {
  e.preventDefault();
  
  const element = e.target;
  const container = element.closest('.swiper-slide');
  
  // Calculate initial offset
  let startX = e.clientX - element.offsetLeft;
  let startY = e.clientY - element.offsetTop;
  
  // Drag move handler
  function dragElement(e) {
    e.preventDefault();
    
    let newX = e.clientX - startX;
    let newY = e.clientY - startY;
    
    const containerRect = container.getBoundingClientRect();
    
    // Constrain movement within container
    newX = Math.max(0, Math.min(newX, containerRect.width - element.offsetWidth));
    newY = Math.max(0, Math.min(newY, containerRect.height - element.offsetHeight));
    
    element.style.left = `${newX}px`;
    element.style.top = `${newY}px`;
    element.style.transform = 'none';
  }
  
  // Stop dragging handler
  function stopDragging() {
    document.removeEventListener('mousemove', dragElement);
    document.removeEventListener('mouseup', stopDragging);
  }
  
  // Add move and stop event listeners
  document.addEventListener('mousemove', dragElement);
  document.addEventListener('mouseup', stopDragging);
}

// Font size slider
fontSizeSlider.addEventListener('input', () => {
  if (selectedText) {
    selectedText.style.fontSize = `${fontSizeSlider.value}px`;
    fontSizeDisplay.textContent = `${fontSizeSlider.value}px`;
  }
});

// Bold button toggle
boldButton.addEventListener('click', () => {
  if (selectedText) {
    selectedText.style.fontWeight = selectedText.style.fontWeight === 'bold' ? 'normal' : 'bold';
  }
});

// Italic button toggle
italicButton.addEventListener('click', () => {
  if (selectedText) {
    selectedText.style.fontStyle = selectedText.style.fontStyle === 'italic' ? 'normal' : 'italic';
  }
});

// Font selection
fontSelect.addEventListener('change', () => {
  if (selectedText) {
    selectedText.style.fontFamily = fontSelect.value;
  }
});

// Color selection
colorSwatches.forEach((color) => {
  color.addEventListener('click', () => {
    if (selectedText) {
      const bgColor = window.getComputedStyle(color).backgroundColor;
      selectedText.style.color = bgColor;
    }
  });
});