class Repository {
  source = "local";

  setSource = function(source) {
    this.source = source;
  }

  read = function() {
    if (this.source == "local") {
      return readFromLocalStorage();
    }
    return readFromRemoteStorage();
  };

  writeTrades = function(data) {
    if (this.source == "local") {
      return saveTradesToLocalStorage(data);
    }
    return saveTradesToRemoteStorage(data);
  };

  writeGroups = function(data) {
    if (this.source == "local") {
      return saveGroupsToLocalStorage(data);
    }
    return saveGroupsToRemoteStorage(data);
  };

  writeSettings = function(setting, data) {
    if (this.source == "local") {
      return saveSettingToLocalStorage(setting, data);
    }
    return saveSettingToRemoteStorage(setting, data);
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

function readFromRemoteStorage() {
  return new Promise((resolve, reject) => {
    
  });
};

function saveTradesToRemoteStorage() {
  return new Promise((resolve, reject) => {
    
  });
};
