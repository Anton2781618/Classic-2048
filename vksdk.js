// Глобальные переменные для хранения данных окружения
window.environmentData = {
    initialized: false,
    userInfo: null
};

function vkBridgeInit() {
    // VK Bridge уже инициализирован в vkbridge.js
    console.log('VK SDK initialized');
    window.environmentData.initialized = true;
}

// Эти функции будут вызываться из Unity через jslib
window.showVKAd = function() {
    if (typeof vkShowInterstitial === 'function') {
        vkShowInterstitial();
    }
};

window.showVKRewardedAd = function() {
    if (typeof vkShowRewarded === 'function') {
        vkShowRewarded();
    }
};

window.vkSaveData = function(key, value) {
    if (typeof window.vkBridge !== 'undefined') {
        window.vkBridge.send('VKWebAppStorageSet', {
            key: key,
            value: value
        });
    }
};

window.vkLoadData = function(key) {
    if (typeof window.vkBridge !== 'undefined') {
        window.vkBridge.send('VKWebAppStorageGet', {
            keys: [key]
        });
    }
};
