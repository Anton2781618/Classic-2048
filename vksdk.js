function vkBridgeInit() {
    // VK Bridge уже инициализирован в vkbridge.js
    console.log('VK SDK initialized');
}

// Эти функции будут вызываться из Unity через jslib
window.showVKAd = function() {
    vkShowInterstitial();
};

window.showVKRewardedAd = function() {
    vkShowRewarded();
};

window.vkSaveData = function(key, value) {
    vkSaveData(key, value);
};

window.vkLoadData = function(key) {
    vkLoadData(key);
};
