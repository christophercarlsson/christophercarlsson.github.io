const baseUrl = "http://us-central1-fxpositiontracker.cloudfunctions.net";
class Repository {
  source = "local";
  userId = null;

  setSource = function(source) {
    this.source = source;
  }

  setUserId = function(userId) {
    this.userId = userId;
  }

  read = function() {
    if (this.source == "local") {
      return readFromLocalStorage();
    }
    return readFromRemoteStorage(this.userId);
  };

  writeTrades = function(data) {
    if (this.source == "local") {
      return saveTradesToLocalStorage(data);
    }
    return saveTradesToRemoteStorage(this.userId, data);
  };

  writeGroups = function(data) {
    if (this.source == "local") {
      return saveGroupsToLocalStorage(data);
    }
    return saveGroupsToRemoteStorage(this.userId, data);
  };

  writeSettings = function(setting, data) {
    if (this.source == "local") {
      return saveSettingToLocalStorage(setting, data);
    }
    return saveSettingToRemoteStorage(this.userId, setting, data);
  };
}

function readFromLocalStorage() {
  return new Promise((resolve, reject) => {
    let data = {};
    if (localStorage.getItem("trades") != null) {
      data.trades = JSON.parse(localStorage.getItem("trades"));
    }

    if (localStorage.getItem("groups") != null) {
      data.groups = JSON.parse(localStorage.getItem("groups"));
    }

    if (localStorage.getItem("custom-pairs") != null) {
      data.customPairs = JSON.parse(localStorage.getItem("custom-pairs"));
    }

    if (localStorage.getItem("disabled-pairs") != null) {
      data.disabledPairs = JSON.parse(localStorage.getItem("disabled-pairs"));
    }

    if (localStorage.getItem("custom-setups") != null) {
      data.customSetups = JSON.parse(localStorage.getItem("custom-setups"));
    }

    if (localStorage.getItem("disabled-setups") != null) {
      data.disabledSetups = JSON.parse(localStorage.getItem("disabled-setups"));
    }

    if (localStorage.getItem("darkmode") != null) {
      data.darkmode = localStorage.getItem("darkmode") == 1;
    }

    if (localStorage.getItem("reviewmode") != null) {
      data.reviewmode = localStorage.getItem("reviewmode") == 1;
    }

    if (localStorage.getItem("tags") != null) {
      data.tags = JSON.parse(localStorage.getItem("tags"));
    }

    if (localStorage.getItem("version") != null) {
      data.version = JSON.parse(localStorage.getItem("version"));
    }

    resolve(data);
  });
};

function saveTradesToLocalStorage(data) {
  return new Promise((resolve, reject) => {
    localStorage.setItem("trades", JSON.stringify(data));
    resolve();
  });
};

function saveGroupsToLocalStorage(data) {
  return new Promise((resolve, reject) => {
    localStorage.setItem("groups", JSON.stringify(data));
    resolve();
  });
};

function saveSettingToLocalStorage(setting, data) {
  return new Promise((resolve, reject) => {
    localStorage.setItem(setting, JSON.stringify(data));
    resolve();
  });
};

function readFromRemoteStorage(userId) {
  if (userId == null) {
    return;
  }

  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: `${baseUrl}/read?userId=${userId}`
    }).then((response) => {
      if (response.status === 200) {
        const { data } = response.data;
        return resolve({
          trades: data["trades"] || [],
          groups: data["groups"] || [],
          customPairs: data["settings"]["custom-pairs"] || [],
          disabledPairs: data["settings"]["disabled-pairs"] || [],
          customSetups: data["settings"]["custom-setups"] || [],
          disabledSetups: data["settings"]["disabled-setups"] || [],
          tags: data["settings"]["tags"] || [],
          darkmode: data["settings"]["darkmode"] || false,
          reviewmode: data["settings"]["reviewmode"] || false,
          version: data["settings"]["version"] || 0,
        });
      }
      
      alert("Could not load trades. Please contact support.");
      reject();
    }).catch((error) => {
      alert("Could not load trades. Please try reloading the page or contacting support. Error: " + error);
      reject();
    });
  });
};

function saveTradesToRemoteStorage(userId, data) {
  if (userId == null) {
    return;
  }

  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `${baseUrl}/storeTrades?userId=${userId}`,
      data: {
        trades: data
      }
    }).then((response) => {
      if (response.status === 200 && response.data.error == false) {
        resolve();
      } else {
        alert("Could not save trades. Please try again.");
        reject();
      }
    }).catch((error) => {
      alert("Could not save trades. Please try reloading the page or contacting support. Error: " + error);
      reject();
    });
  });
};

function saveGroupsToRemoteStorage(userId, data) {
  if (userId == null) {
    return;
  }

  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `${baseUrl}/storeGroups?userId=${userId}`,
      data: {
        groups: data
      }
    }).then((response) => {
      if (response.status === 200 && response.data.error == false) {
        resolve();
      } else {
        alert("Could not save groups. Please try again.");
        reject();
      }
    }).catch((error) => {
      alert("Could not save groups. Please try reloading the page or contacting support. Error: " + error);
      reject();
    });
  });
};

function saveSettingToRemoteStorage(userId, setting, data) {
  if (userId == null) {
    return;
  }

  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: `${baseUrl}/storeSetting?userId=${userId}`,
      data: {
        setting: setting,
        value: data
      }
    }).then((response) => {
      if (response.status === 200 && response.data.error == false) {
        resolve();
      } else {
        alert("Could not save settings. Please try again.");
        reject();
      }
    }).catch((error) => {
      alert("Could not save settings. Please try reloading the page or contacting support. Error: " + error);
      reject();
    });
  });
};
