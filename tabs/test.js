'use strict'
const path = require('path');

const { GUI, TABS } = require('./../js/gui');
const i18n = require('./../js/localization');
const Store = require('electron-store');
const store = new Store();

const stdProfiles = [
    {
        name: "OSD",
    },
    {
        name: "Sensors",
    }
];

TABS.test = {};
TABS.test.initialize = (callback) => {
    
    if (GUI.active_tab != 'test') {
        GUI.active_tab = 'test';
    }

    GUI.load(path.join(__dirname, "test.html"), function () {
        i18n.localize();
    
    var currentProfile, profiles;
    var profiles_e = $('#testProfile');

    profiles = stdProfiles.slice(0);
    var testProfiles = store.get('testProfiles', false);
    if (testProfiles) {
        profiles.push(...testProfiles);
    }
    initElements(true);
    
    
    profiles_e.on('change', () => {
        updateCurrentProfile();
    });

    function initElements(init)
    {
        profiles.forEach(profile => {
            profiles_e.append(`<option value="${profile.name}">${profile.name}</option>`)
        });

        if (init) {

            var testLastProfile = store.get('testLastProfile', false);
            if (testLastProfile) {    
                var element = profiles.find(profile => {
                    return profile.name == testLastProfile;
                });

                if (element)
                    profiles_e.val(element.name).trigger('change');
            }
        }
        
        updateCurrentProfile();
    }

    function updateCurrentProfile() {
       var selected = profiles_e.find(':selected').val(); 
       var selectedIndex = profiles.findIndex(element => {     
            return element.name == selected;
        });
        currentProfile = profiles[selectedIndex];

        store.set('testLastProfile', selected);
    }

    GUI.content_ready(callback);
    });
};

TABS.test.cleanup = (callback) => {
    if (callback) 
        callback();
};
