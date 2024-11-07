// Detect the current site by checking the URL
const currentUrl = window.location.href;
let site = "";

if (currentUrl.includes('lu.ma')) {
    site = 'lu.ma';
} else if (currentUrl.includes('meetup')) {
    site = 'meetup';
} else if (currentUrl.includes('eventbrite')) {
    site = 'eventbrite';
} else if (currentUrl.includes('allevents.in')) {
    site = 'allevents.in';
} else {
    site = 'unknown';
}

// Function to filter and format event text data
function Extract(text) {
    let filteredText = text.split(':')[0]; // Split at the first colon and keep the part before it

    return filteredText
        .replace(/[^\w\s]/g, '')  // Remove all non-alphanumeric characters (except spaces)
        .split(' ')  // Split by spaces
        .filter(word => word.trim() !== '')  // Remove any empty strings
        .join('');  // Join words back into a single string without spaces
}

// Create an iframe element with custom styling
const iframe = document.createElement('iframe');
iframe.src = 'https://beta.popin.site/Signin';
iframe.style.width = '95%';
iframe.style.height = '650px';
iframe.style.border = 'none';
iframe.style.margin = '5px';
iframe.style.padding = '5px';
iframe.style.borderRadius = '20px';

let targetContainer;

// Function to embed the iframe in the correct container based on the detected site
function embedFrame(site) {
    switch (site) {
        case 'lu.ma':
            // Locate the registration button or specific event page container
            var register_button = document.querySelector('button.btn.luma-button.flex-center.medium primary.solid.variant-color-primary.full-width no-icon');
            var register_div = register_button.childNodes[0];
            if (!register_div) targetContainer = document.querySelector('.event-page-left');
            if (targetContainer) {
                targetContainer.appendChild(iframe);
                console.log("Iframe added to container:", targetContainer);
            } else {
                console.log("Failed to find target container.");
            }
            break;
        case 'meetup':
            const element = document.querySelector('div.text-white[data-testid="event-going-banner"]');
            if (element) {
                const node = document.querySelector('div#event-info');
                targetContainer = node.parentNode;

                // Check if iframe is already embedded to avoid duplicates
                if (targetContainer && !targetContainer.querySelector('iframe') && element) {
                    targetContainer.insertBefore(iframe, targetContainer.firstChild.nextSibling);
                    console.log("Button container added to container:", targetContainer);
                }
            } else {
                // Observe the document for changes until target elements are found
                const observer1 = new MutationObserver((mutations) => {
                    mutations.forEach((mutation) => {
                        mutation.addedNodes.forEach((addedNode) => {
                            console.log("Added node:", addedNode);

                            const nodes = document.querySelectorAll('div.flex.items-center.justify-between');
                            if (nodes.length > 2) {
                                const container = nodes[1].parentNode.parentNode;
                                const element = document.querySelector('div.text-white[data-testid="event-going-banner"]');

                                // Append iframe if conditions are met and stop observing further
                                if (container && !container.querySelector('iframe') && element) {
                                    container.insertBefore(iframe, container.firstChild.nextSibling);
                                    observer1.disconnect();
                                } else {
                                    console.log("Button container already exists or required element not found.");
                                }
                            } else {
                                console.log("Not enough nodes found to identify the container.");
                            }
                        });
                    });
                });

                // Start observing the entire document
                observer1.observe(document.body, {
                    childList: true,
                    subtree: true 
                });

                console.log("Started observing DOM mutations for meetup.com.");
            }
            break;

        case 'eventbrite':
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    mutation.addedNodes.forEach((node) => {
                        if (node.tagName === 'IFRAME' && !node.hasAttribute('data-custom-added')) {
                            console.log("Detected new iframe:", node);

                            const parentElement = document.querySelector('div.ticket-selection');
                            if (parentElement) {
                                console.log("Found parent element:", parentElement);
                                parentElement.appendChild(iframe);
                                console.log("Custom iframe added to parent element.");
                                node.setAttribute('data-custom-added', 'true'); // Mark iframe as handled
                            }
                        }
                    });
                });
            });

            // Observe the document for new iframe additions
            observer.observe(document.body, {
                childList: true,
                subtree: true 
            });
            break;

        case 'allevents.in':
            // Locate target container and insert iframe if found
            targetContainer = document.querySelector('div.span4');
            if (targetContainer) {
                targetContainer.insertBefore(iframe, targetContainer.firstChild.nextSibling);
                console.log("Iframe added to container:", targetContainer);
            } else {
                console.log("Failed to find target container.");
            }
            break;

        default:
            console.warn('Unknown site:', site);
            return;
    }
    generateEventData(site);
}

// Default event information structure
let eventInfo = {
    title: "Default Event Title",
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    location: {
        name: "Online",
        city: "Unknown City",
        province: "Unknown Province",
        country: "Unknown Country",
        streetAddress: "Unknown Street Address"
    },
    description: "Event description goes here."
};

// Function to assign values to eventInfo from the retrieved event data
function assignInfo(eventData) {
    eventInfo.title = eventData.name || eventInfo.title;
    eventInfo.startDate = eventData.startDate || eventInfo.startDate;
    eventInfo.endDate = eventData.endDate || eventInfo.endDate;
    eventInfo.location.name = eventData.location?.name || eventInfo.location.name;
    eventInfo.location.city = eventData.location?.address?.addressLocality || eventInfo.location.city;
    eventInfo.location.province = eventData.location?.address?.addressRegion || eventInfo.location.province;
    eventInfo.location.country = eventData.location?.address?.addressCountry || eventInfo.location.country;
    eventInfo.location.streetAddress = eventData.location?.address?.streetAddress || eventInfo.location.streetAddress;
    eventInfo.description = eventData.description || eventInfo.description;
}

// Extract and generate event data based on the site
async function generateEventData(site) {
    const scriptTags = document.querySelectorAll('script[type="application/ld+json"]');
    const scriptTag_Mode = Array.from(scriptTags).find(st => {
        const data = JSON.parse(st.innerText);
        return data.eventAttendanceMode;
    });

    let eventData;

    // Parse and assign event data based on site
    switch (site) {
        case 'lu.ma':
            eventData = JSON.parse(scriptTags[0].innerText);
            assignInfo(eventData);
            break;
        case 'meetup.com':
            eventData = JSON.parse(scriptTags[1].innerText);
            assignInfo(eventData);
            break;
        case 'eventbrite':
            eventData = JSON.parse(scriptTag_Mode.innerText);
            assignInfo(eventData);
            break;
        case 'allevents.in':
            eventData = JSON.parse(scriptTags[0].innerText);
            assignInfo(eventData);
            break;
        default:
            break;
    }

    const startDate = new Date(eventInfo.startDate);
    const dateDigits = startDate.toISOString().split('T')[0].replace(/-/g, '');
    const eventTitle_Local = Extract(eventInfo.title) + Extract(eventInfo.location.name);
    const eventId = `${eventTitle_Local}${dateDigits}`;
    console.log("Generated Event ID:", eventId);

    return { eventInfo, eventId };
}

// Observe for the removal of the iframe container and re-insert if necessary
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        mutation.removedNodes.forEach((node) => {
            if (node === targetContainer) {
                console.log("Iframe container was removed, re-inserting...");
                embedFrame(site);
            }
        });
    });
});

observer.observe(document.body, { childList: true, subtree: true });
embedFrame(site);  // Initial iframe embedding based on site
console.log("Frame created");
