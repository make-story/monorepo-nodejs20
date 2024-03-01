const message1 = '[Here is app 1] Successfully loaded';
console.log(message1);
window.parent.postMessage('This is message from app1 received by app2', '*');
