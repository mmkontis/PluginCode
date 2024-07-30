// Function to create and inject the GPT reply button
function injectGPTReplyButton(tweet) {
  const actionBar = tweet.querySelector('[role="group"]');
  if (actionBar && !actionBar.querySelector('.gpt-reply-btn')) {
    const gptReplyBtn = document.createElement('button');
    gptReplyBtn.className = 'gpt-reply-btn';
    gptReplyBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5 mr-1">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
      </svg>
      GPT Reply
    `;
    gptReplyBtn.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      openReplyWithStyles(tweet);
    });
    actionBar.appendChild(gptReplyBtn);
    console.log('GPT Reply button injected');
  }
}

// Function to open reply with style buttons
function openReplyWithStyles(tweet) {
  console.log('openReplyWithStyles called');
  const replyButton = tweet.querySelector('[data-testid="reply"]');
  if (replyButton) {
    console.log('Reply button found, clicking');
    replyButton.click();
    setTimeout(() => {
      const replyInput = document.querySelector('[data-testid="tweetTextarea_0"]');
      if (replyInput) {
        console.log('Reply input found, injecting style buttons');
        const styleButtonsContainer = document.createElement('div');
        styleButtonsContainer.className = 'gpt-style-buttons';
        
        const styles = ["Bold", "Sassy", "Badbitch", "Socrates", "Steve Jobs", "Adam Neumann"];
        styles.forEach(style => {
          const button = document.createElement('button');
          button.className = 'gpt-style-btn';
          button.textContent = style;
          button.addEventListener('click', () => {
            console.log(`Style button clicked: ${style}`);
            styleButtonsContainer.style.display = 'none';
            generateReply(tweet, style, replyInput);
          });
          styleButtonsContainer.appendChild(button);
        });
        
        replyInput.parentElement.appendChild(styleButtonsContainer);
        console.log('Style buttons injected');
      } else {
        console.error('Reply input not found');
      }
    }, 1000);
  } else {
    console.error('Reply button not found');
  }
}

async function fetchGPTResponses(tweetContent, style) {
  console.log(`Fetching GPT responses for tweet: "${tweetContent}" with style: ${style}`);
  try {
    const response = await fetch('https://reply-bot-server.vercel.app/api/generate-replies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ tweetContent, style }),
      mode: 'cors',
    });

    console.log('Response status:', response.status);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Received responses:', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// Function to generate a reply
async function generateReply(tweet, style, replyInput) {
  console.log(`generateReply called with style: ${style}`);
  const tweetContent = tweet.querySelector('[data-testid="tweetText"]')?.textContent;
  if (!tweetContent) {
    console.error('Tweet content not found');
    return;
  }
  console.log(`Tweet content: "${tweetContent}"`);
  
  // Show loader
  const loader = document.createElement('div');
  loader.className = 'gpt-loader';
  loader.textContent = 'Generating replies...';
  replyInput.parentElement.appendChild(loader);
  console.log('Loader added');
  
  try {
    console.log('Fetching GPT responses...');
    const responses = await fetchGPTResponses(tweetContent, style);
    console.log('Responses received:', responses);
    
    loader.remove();
    
    const responseBubbles = document.createElement('div');
    responseBubbles.className = 'gpt-response-bubbles';
    
    responses.forEach((response) => {
      const bubble = document.createElement('div');
      bubble.className = 'gpt-response-bubble';
      bubble.textContent = response;
      bubble.addEventListener('click', () => copyAndPaste(response, replyInput, bubble));
      responseBubbles.appendChild(bubble);
    });
    
    replyInput.parentElement.appendChild(responseBubbles);
    console.log('Response bubbles added');
  } catch (error) {
    console.error('Error generating replies:', error);
    loader.textContent = 'Error generating replies. Please try again.';
    // Display error message to the user
    const errorBubble = document.createElement('div');
    errorBubble.className = 'gpt-error-bubble';
    errorBubble.textContent = `Error: ${error.message}. Please try again later.`;
    replyInput.parentElement.appendChild(errorBubble);
  }
}

// Function to copy and paste the response
function copyAndPaste(text, input, bubble) {
  console.log('Copying and pasting text:', text);
  // Copy to clipboard
  navigator.clipboard.writeText(text).then(() => {
    console.log('Text copied to clipboard');
    
    // Paste simulation
    input.focus();
    const dataTransfer = new DataTransfer();
    dataTransfer.setData('text/plain', text);
    input.dispatchEvent(new ClipboardEvent('paste', {
      clipboardData: dataTransfer,
      bubbles: true,
      cancelable: true
    }));

    // Show feedback
    showCopyPasteFeedback(bubble);

    // Hide response bubbles and show action icons
    const responseBubbles = bubble.parentElement;
    responseBubbles.style.display = 'none';
    showActionIcons(input, responseBubbles);
  }).catch(err => {
    console.error('Failed to copy text: ', err);
  });
}

function showCopyPasteFeedback(bubble) {
  bubble.classList.add('copied');
  setTimeout(() => {
    bubble.classList.remove('copied');
  }, 2000);
}

function showActionIcons(input, responseBubbles) {
  const actionIcons = document.createElement('div');
  actionIcons.className = 'gpt-action-icons';
  
  const backIcon = document.createElement('button');
  backIcon.className = 'gpt-action-icon';
  backIcon.innerHTML = '&#8592;'; // Left arrow
  backIcon.addEventListener('click', () => {
    input.value = '';
    responseBubbles.style.display = 'flex';
    actionIcons.remove();
  });
  
  const resetIcon = document.createElement('button');
  resetIcon.className = 'gpt-action-icon';
  resetIcon.innerHTML = '&#8635;'; // Refresh symbol
  resetIcon.addEventListener('click', () => {
    clearByFocus(input);
    const styleButtons = document.querySelector('.gpt-style-buttons');
    if (styleButtons) {
      styleButtons.style.display = 'flex';
    }
    responseBubbles.remove();
    actionIcons.remove();
  });

  actionIcons.appendChild(backIcon);
  actionIcons.appendChild(resetIcon);
  input.parentElement.appendChild(actionIcons);
}

function clearByFocus(input) {
  input.focus();
  document.execCommand('selectAll', false, null);
  document.execCommand('delete', false, null);
  input.dispatchEvent(new Event('input', { bubbles: true }));
}

// Observer to watch for new tweets being added to the DOM
const observer = new MutationObserver(mutations => {
  for (const mutation of mutations) {
    for (const node of mutation.addedNodes) {
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tweets = node.querySelectorAll('[data-testid="tweet"]');
        tweets.forEach(injectGPTReplyButton);
      }
    }
  }
});

// Start observing the document body for changes
observer.observe(document.body, { childList: true, subtree: true });

// Initial pass to add buttons to existing tweets
document.querySelectorAll('[data-testid="tweet"]').forEach(injectGPTReplyButton);

function injectStyles() {
  const link = document.createElement('link');
  link.href = chrome.runtime.getURL('styles.css');
  link.type = 'text/css';
  link.rel = 'stylesheet';
  document.head.appendChild(link);
}

// Call these functions when your script starts
injectStyles();