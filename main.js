
javascript:
const processedPairs = new Set(JSON.parse(localStorage.getItem("processedPairs")) || []);

function saveProcessedPairs() {
  localStorage.setItem("processedPairs", JSON.stringify(Array.from(processedPairs)));
}

function simulateDragAndDrop(element, startX, startY, targetX, targetY, steps = 10) {
  function triggerMouseEvent(target, eventType, clientX, clientY) {
    const event = new MouseEvent(eventType, {
      bubbles: true,
      cancelable: true,
      clientX,
      clientY,
      view: window,
    });
    target.dispatchEvent(event);
  }

  triggerMouseEvent(element, "mousedown", startX, startY);

  let currentX = startX;
  let currentY = startY;
  const deltaX = (targetX - startX) / steps;
  const deltaY = (targetY - startY) / steps;

  return new Promise((resolve) => {
    function moveMouse() {
      currentX += deltaX;
      currentY += deltaY;
      triggerMouseEvent(document, "mousemove", currentX, currentY);

      if (Math.abs(currentX - targetX) < Math.abs(deltaX) && Math.abs(currentY - targetY) < Math.abs(deltaY)) {
        triggerMouseEvent(document, "mouseup", targetX, targetY);

        element.style.position = "absolute";
        element.style.left = `${targetX}px`;
        element.style.top = `${targetY}px`;

        resolve();
      } else {
        requestAnimationFrame(moveMouse);
      }
    }
    requestAnimationFrame(moveMouse);
  });
}

async function processCombination(firstItem, secondItem, targetX, targetY) {
  const firstRect = firstItem.getBoundingClientRect();
  const secondRect = secondItem.getBoundingClientRect();

  const firstStartX = firstRect.x + firstRect.width / 2;
  const firstStartY = firstRect.y + firstRect.height / 2;

  const secondStartX = secondRect.x + secondRect.width / 2;
  const secondStartY = secondRect.y + secondRect.height / 2;

  /*
  console.log("Processing Combination:");
  console.log("First Item Position:", firstStartX, firstStartY);
  console.log("Second Item Position:", secondStartX, secondStartY);
  console.log("Target Position:", targetX, targetY);
  */

  await simulateDragAndDrop(firstItem, firstStartX, firstStartY, targetX, targetY);
  await simulateDragAndDrop(secondItem, secondStartX, secondStartY, targetX, targetY);
  await clickClearButton();
}

async function clickClearButton() {
  const clearBtn = document.getElementsByClassName("clear")[0];
  if (clearBtn) {
    clearBtn.click();
    await new Promise((resolve) => setTimeout(resolve, 100));
  } else {
    /*
    console.error("Clear button not found.");
    */
  }
}

async function processItems(items) {
  /*
  console.log("Items:", items);
  */

  if (!items || items.length === 0) {
    /*
    console.error("No items found.");
    */
    return;
  }

  for (let i = 0; i < items.length; i++) {
    for (let j = 0; j < items.length; j++) {
      if (!items[i] || !items[j]) {
        /*
        console.error(`Item at index ${i} or ${j} is undefined.`);
        */
        continue;
      }

      if (!processedPairs.has(`${i}-${j}`)) {
        processedPairs.add(`${i}-${j}`);

        /*
        console.log(`Processing combination: ${i}-${j}`);
        */
        await processCombination(items[i], items[j], 500, 100);
      }
    }
  }

  saveProcessedPairs();
}

const items = document.querySelectorAll(".item");
processItems(items);
