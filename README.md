# Backend API 

API endpoints and how to use them

## /users

### /register
POST BODY REQUIRES {
    "username": "UserName123",
    "password": "Password123"
}

OPTIONAL {
    "profileName": "My Name",
    "profileImage": "image.png",
    "bio": "bla balb alb lab"
}

RETURNS {token}

### /login 
POST BODY REQUIRES {
    "username": "UserName123",
    "password": "Password123"
}

RETURNS {token}

### /profile
GET REQUIRES {token} 

RETURNS {
    "id": "UUID",
    "username": "UserName",
    "profile_name": "Profile Name",
    "bio": "Blab balbalbalbalabl",
    "thumbnail_url": "picture.jpg",
    "saved_hashtags": [
        "#banana",
        "#apple"
    ]
}

PUT REQUIRES {token}
BODY REQUIRES {
    "profileName": "My Name",
    "profileImage": "image.png",
    "bio": "bla balb alb lab"
}

RETURNS {
    "username": "UserName",
    "profile_name": "Profile Name",
    "bio": "Blab balbalbalbalabl",
    "thumbnail_url": "picture.jpg"
}

### /:username
GET 
RETURNS {
    "username": "UserName",
    "profile_name": "Profile Name",
    "bio": "Blab balbalbalbalabl",
    "thumbnail_url": "picture.jpg"
    "posts":
    [
        {posts}
    ]
}
