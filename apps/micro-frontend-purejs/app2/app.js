const message2 = '[Here is app 2] Successfully loaded';
console.log(message2);

window.addEventListener('message', event => {
  if (event.data && typeof event.data === 'string') {
    console.log(`Received Message: ${event.data}`);
  }
});

// Declare function
function greet(name) {
  console.log(`Hello, ${name}!`);
}

// Send the function to main.js
window.parent.postMessage(
  { type: 'function', name: 'greet', code: greet.toString() },
  '*',
);
