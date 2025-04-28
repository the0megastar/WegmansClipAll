document.getElementById('clipCoupons').addEventListener('click', async () => {
  const statusDiv = document.getElementById('status');
  
  // Current Actice Tab
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  
  // Website Check
  if (!tab.url.includes('wegmans.com') && !tab.url.includes('shop.wegmans.com')) {
    statusDiv.textContent = 'Please navigate to the Wegmans coupons page first.';
    return;
  }
  
  try {
    // Execute the Script
    const result = await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: clipAllCoupons
    });
    
    // Display results
    if (result && result[0]) {
      const count = result[0].result;
      statusDiv.textContent = `${count} coupons clipped successfully!`;
    }
  } catch (error) {
    statusDiv.textContent = `Error: ${error.message}`;
  }
});

function clipAllCoupons() {
  // Select All Clip Coupon Buttons In View, Manual Scroll Down May Be Needed
  const clipButtons = document.querySelectorAll('button.clip-button');
  
  console.log(`Found ${clipButtons.length} coupon buttons to clip`);
  
  // Loop Through Each Button. Trigger Click. Delay.
  let clippedCount = 0;
  
  Array.from(clipButtons).forEach((button, index) => {
    // Delay
    setTimeout(() => {
      try {
        button.click();
        clippedCount++;
        console.log(`Clipped coupon ${index + 1}`);
      } catch (e) {
        console.error(`Error clicking button ${index + 1}:`, e);
      }
    }, index * 300); // Delay Between Each Click
  });
  
  // Return Number Of Clipped Coupons
  return clipButtons.length;
}
