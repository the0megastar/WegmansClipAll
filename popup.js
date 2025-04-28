document.getElementById('clipCoupons').addEventListener('click', async () => {
  const statusDiv = document.getElementById('status');
  
  // Get current active tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Check if we're on a Wegmans website
  if (!tab.url.includes('wegmans.com') && !tab.url.includes('shop.wegmans.com')) {
    statusDiv.textContent = 'Please navigate to the Wegmans coupons page first.';
    return;
  }
  
  try {
    // Execute the clipping script
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: clipAllCoupons
    });
    
    // Display the result
    if (result && result[0]) {
      const count = result[0].result;
      statusDiv.textContent = `${count} coupons clipped successfully!`;
    }
  } catch (error) {
    statusDiv.textContent = `Error: ${error.message}`;
  }
});

// Function to be executed in the context of the web page
function clipAllCoupons() {
  // Select all coupon clip buttons using the exact selector from the website
  const clipButtons = document.querySelectorAll('button.clip-button');
  
  console.log(`Found ${clipButtons.length} coupon buttons to clip`);
  
  // Loop through each button and trigger a click event with a delay
  let clippedCount = 0;
  
  Array.from(clipButtons).forEach((button, index) => {
    // Add a small delay between clicks to prevent rate limiting
    setTimeout(() => {
      try {
        button.click();
        clippedCount++;
        console.log(`Clipped coupon ${index + 1}`);
      } catch (e) {
        console.error(`Error clicking button ${index + 1}:`, e);
      }
    }, index * 300); // 300ms delay between each click
  });
  
  // Return the number of coupons we attempted to clip
  return clipButtons.length;
}