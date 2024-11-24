// Глобальные переменные для хранения данных окружения
window.environmentData = {
    initialized: false,
    userInfo: null
};

// Глобальная переменная для облачных сохранений
window.cloudSaves = {
    initialized: false,
    data: {}
};

function vkBridgeInit() {
    // VK Bridge уже инициализирован в vkbridge.js
    console.log('VK SDK initialized');
    window.environmentData.initialized = true;
    window.cloudSaves.initialized = true;
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
        window.cloudSaves.data[key] = value;
        return window.vkBridge.send('VKWebAppStorageSet', {
            key: key,
            value: value
        });
    }
};

window.vkLoadData = function(key) {
    if (typeof window.vkBridge !== 'undefined') {
        return window.vkBridge.send('VKWebAppStorageGet', {
            keys: [key]
        }).then(function(data) {
            if (data && data.keys && data.keys[0]) {
                window.cloudSaves.data[key] = data.keys[0].value;
            }
            return data;
        });
    }
};

// Инициализация облачных сохранений
window.InitCloudStorage = function() {
    if (!window.cloudSaves.initialized) {
        window.cloudSaves = {
            initialized: true,
            data: {}
        };
    }
    return window.cloudSaves;
};
