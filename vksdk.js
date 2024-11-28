/* Является оберткой высокого уровня
Содержит глобальные переменные и состояния (environmentData, cloudSaves)
Предоставляет абстракцию для работы с разными типами хранилищ (localStorage и облачное хранилище)
Реализует дополнительную логику и проверки
Работает как промежуточный слой между Unity и VK Bridge
 */

// Глобальные переменные для хранения данных окружения
window.environmentData = 
{
    initialized: false,
    
    userInfo: null
};

// Глобальная переменная для облачных сохранений
window.cloudSaves = 
{
    initialized: false,
    
    data: {}
};

// Глобальная переменная для выбора типа хранилища
window.useLocalStorage = false;

function vkBridgeInit() 
{
    // VK Bridge уже инициализирован в vkbridge.js
    console.log('VK SDK initialized');
    
    window.environmentData.initialized = true;
    
    window.cloudSaves.initialized = true;
}

// Эти функции будут вызываться из Unity через jslib
window.showVKAd = function() 
{
    if (typeof vkShowInterstitial === 'function') 
    {
        vkShowInterstitial();
    }
};

window.showVKRewardedAd = function() 
{
    if (typeof vkShowRewarded === 'function') 
    {
        vkShowRewarded();
    }
};

// Функция для сохранения данных (поддерживает оба типа хранилища)
window.vkSaveData = function(key, value) 
{
    if (window.useLocalStorage) 
    {
        try 
        {
            localStorage.setItem(key, value);
            
            console.log('Saved to localStorage:', { key, value });
            
            // Уведомляем Unity об успешном сохранении
            if (window.unityInstance) 
            {
                window.unityInstance.SendMessage('VKPlatformSDK', 'OnSaveComplete', key);
            }
        } 
        catch (error) 
        {
            console.error('Error saving to localStorage:', error);
            
            if (window.unityInstance) 
            {
                window.unityInstance.SendMessage('VKPlatformSDK', 'OnSaveError', error.toString());
            }
        }
    } 
    else 
    if (typeof window.vkBridge !== 'undefined') 
    {
        window.cloudSaves.data[key] = value;
        
        return window.vkBridge.send('VKWebAppStorageSet', 
        {
            key: key,
            value: value
        });
    }
};

// Функция для загрузки данных (поддерживает оба типа хранилища)
window.vkLoadData = function(key) 
{
    if (window.useLocalStorage) 
    {
        try 
        {
            const value = localStorage.getItem(key) || '';
            console.log('Loaded from localStorage:', { key, value });
            
            // Отправляем данные в Unity
            if (window.unityInstance) 
            {
                window.unityInstance.SendMessage('VKPlatformSDK', 'JSOnLoadComplete', JSON.stringify(
                {
                    key: key,
                    value: value
                }));
            }
            else
            {
                console.log('!!!! Не получилось отправить данные в Unity, так как unityInstance не определен !!!!');
            }
        } 
        catch (error) 
        {
            console.error('Error loading from localStorage:', error);
            
            if (window.unityInstance) 
            {
                window.unityInstance.SendMessage('VKPlatformSDK', 'JSOnLoadError', error.toString());
            }
        }
    } 
    else 
    if (typeof window.vkBridge !== 'undefined') 
    {
        vkBridge.send('VKWebAppStorageGet', 
        {
            keys: [key]
        })
        .then(function(data) 
        {
            console.log('Data loaded from VK:', data);
            
            if (data && data.keys && data.keys[0]) 
            {
                window.cloudSaves.data[key] = data.keys[0].value;
                
                if (window.unityInstance) 
                {
                    window.unityInstance.SendMessage('VKPlatformSDK', 'JSOnLoadComplete', JSON.stringify(
                    {
                        key: key,
                        value: data.keys[0].value
                    }));
                }
                else
                {
                    console.log('!!!! Не получилось отправить данные в Unity, так как unityInstance не определен !!!!');
                }
            } 
            else 
            {
                if (window.unityInstance) 
                {
                    window.unityInstance.SendMessage('VKPlatformSDK', 'JSOnLoadComplete', JSON.stringify(
                    {
                        key: key,
                        value: ''
                    }));
                }
                else
                {
                    console.log('!!!! Не получилось отправить данные в Unity, так как unityInstance не определен !!!!');
                }
            }
        })
        .catch(function(error) 
        {
            console.error('Error loading from VK:', error);
            
            if (window.unityInstance) 
            {
                window.unityInstance.SendMessage('VKPlatformSDK', 'JSOnLoadError', error.toString());
            }
            else
            {
                console.log('!!!! Не получилось отправить ошибку в Unity, так как unityInstance не определен !!!!');
            }
        });
    }
};

// Инициализация облачных сохранений
window.InitCloudStorage = function() 
{
    if (!window.cloudSaves.initialized) 
    {
        window.cloudSaves = 
        {
            initialized: true,
            data: {}
        };
    }
    return window.cloudSaves;
};

// Функция для установки типа хранилища
window.setStorageType = function(useLocal) 
{
    window.useLocalStorage = useLocal;
    console.log('Storage type set to:', useLocal ? 'localStorage' : 'cloud storage');
};
