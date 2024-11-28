    /* 
    Отвечает за непосредственное взаимодействие с VK Bridge API
    Содержит основную логику инициализации VK Bridge
    Реализует прямые вызовы методов VK Bridge (реклама, сохранение/загрузка данных)
    Обрабатывает ответы от VK Bridge и отправляет их в Unity через SendMessage
    Работает напрямую с VK API 
    */
(function() {
    // Проверяем доступность VK Bridge
    if (typeof vkBridge === 'undefined') 
    {
        console.error('VK Bridge is not loaded');
        return;
    }

    // Инициализация VK Bridge
    vkBridge.send('VKWebAppInit')
        .then(function() 
        {
            console.log('VK Bridge initialized');
            // После успешной инициализации получаем данные пользователя
            return vkBridge.send('VKWebAppGetUserInfo');
        })
        .then(function(data) 
        {
            console.log('User data received:', data);
            if (window.environmentData) 
            {
                window.environmentData.userInfo = data;
            }
            
            SendMessage('VKPlatformSDK', 'JSOnUserDataReceived', JSON.stringify(data));
            
            // После получения данных пользователя пробуем загрузить сохранения
            console.log('Attempting to load saved data...');
            
            window.vkLoadData('SavedGameData');
        })
        .catch(function(error) 
        {
            console.error('VK Bridge error:', error);
        });

    // Методы для работы с рекламой
    window.showVKAd = function() 
    {
        vkBridge.send('VKWebAppShowNativeAds', 
        {
            ad_format: 'interstitial'
        })
        .then(function(data) 
        {
            console.log('Interstitial ad shown:', data);
            SendMessage('VKPlatformSDK', 'JSOnAdCompleted');
        })
        .catch(function(error) 
        {
            console.error('Show interstitial ad error:', error);
            SendMessage('VKPlatformSDK', 'JSOnAdError', error.toString());
        });
    };

    window.showVKRewardedAd = function() 
    {
        vkBridge.send('VKWebAppShowNativeAds', 
        {
            ad_format: 'reward'
        })
        .then(function(data) 
        {
            console.log('Rewarded ad shown:', data);
            SendMessage('VKPlatformSDK', 'JSOnRewardedAdCompleted');
        })
        .catch(function(error) 
        {
            console.error('Show rewarded ad error:', error);
            SendMessage('VKPlatformSDK', 'JSOnAdError', error.toString());
        });
    };

    // Сообщаем о готовности VK Bridge
    console.log('VK Bridge methods initialized');
})();
