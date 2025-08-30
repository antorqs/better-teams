// Default settings

const DEFAULTS = {
  enablePreviews: true,
  enableUITweaks: true
};


function loadOptions() {
  chrome.storage.sync.get(null, (settings) => {
    document.getElementById('enablePreviews').checked = settings.enablePreviews !== false;
    document.getElementById('enableUITweaks').checked = settings.enableUITweaks !== false;
  });
}

function saveOptions() {
  chrome.storage.sync.set({
    enablePreviews: document.getElementById('enablePreviews').checked,
    enableUITweaks: document.getElementById('enableUITweaks').checked
  });
}

document.getElementById('enablePreviews').addEventListener('change', saveOptions);
document.getElementById('enableUITweaks').addEventListener('change', saveOptions);
document.getElementById('resetBtn').addEventListener('click', () => {
  document.getElementById('enablePreviews').checked = true;
  document.getElementById('enableUITweaks').checked = true;
  saveOptions();
});

document.addEventListener('DOMContentLoaded', loadOptions);
