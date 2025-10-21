# Backend API 

API endpoints and how to use them

## /users

### /register
POST REQUIRES {
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
POST REQUIRES {
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
}

### /:username/posts
GET
RETURNS [
    {
        "id": 1,
        "user_owner": "Alexandria.Stamm",
        "title": "following furthermore hollow arid er starch swing",
        "description": "Videlicet tepesco sumptus universe. Conor accusamus sed occaecati barba vomer. Comminor bos celo atavus tenetur inflammatio aliqua utor abscido aqua.",
        "post_type": "Text",
        "post_url": null,
        "likes": 0,
        "dislikes": 0,
        "hashtags": [
            "#other",
            "#pfft"
        ],
        "post_date": "2025-10-21T19:27:35.668Z"
    }
]

