class Api {
  constructor(options) {
    this.baseUrl = options.baseUrl;
  }

  _getHeaders() {
    const token = localStorage.getItem("jwt");
    return {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    };
  }

  _checkResponse(res) {
    if (!res.ok) return res.json().then((err) => Promise.reject(err));
    return res.json();
  }

  getUserInfo() {
    return fetch(`${this.baseUrl}/users/me`, {
      method: "GET",
      headers: this._getHeaders(),
      credentials: "include",
    }).then(this._checkResponse);
  }

  getInitialCards() {
    return fetch(`${this.baseUrl}/cards`, {
      method: "GET",
      headers: this._getHeaders(),
      credentials: "include",
    }).then(this._checkResponse);
  }

  updateUserProfile(name, about) {
    return fetch(`${this.baseUrl}/users/me`, {
      method: "PATCH",
      headers: this._getHeaders(),
      body: JSON.stringify({ name, about }),
      credentials: "include",
    }).then(this._checkResponse);
  }

  addNewCard(name, link) {
    return fetch(`${this.baseUrl}/cards`, {
      method: "POST",
      headers: this._getHeaders(),
      body: JSON.stringify({ name, link }),
      credentials: "include",
    }).then(this._checkResponse);
  }

  toggleLike(cardId, isLiked) {
    return fetch(`${this.baseUrl}/cards/${cardId}/likes`, {
      method: isLiked ? "DELETE" : "PUT",
      headers: this._getHeaders(),
      credentials: "include",
    }).then(this._checkResponse);
  }

  deleteCard(cardId) {
    return fetch(`${this.baseUrl}/cards/${cardId}`, {
      method: "DELETE",
      headers: this._getHeaders(),
      credentials: "include",
    }).then(this._checkResponse);
  }

  updateProfileAvatar(avatar) {
    return fetch(`${this.baseUrl}/users/me/avatar`, {
      method: "PATCH",
      headers: this._getHeaders(),
      body: JSON.stringify({ avatar }),
      credentials: "include",
    }).then(this._checkResponse);
  }
}

const api = new Api({
  baseUrl: "https://api.aroundcr.minnsroad.com",
});

export default api;
