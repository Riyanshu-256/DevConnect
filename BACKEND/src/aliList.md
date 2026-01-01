# DevTinder APIs

## authRouter
-POST/signup
-POST/login
-POST/logout

## profileRouter
-GET/profile/view
-PATCH/profile/edit
-PATCH/profile/password

## connectionRequestRouter
-POST/request/send/status/:userId
-POST/request/review/status/:requestId

## userRouter
-GET/user/connections
-GET/user/requests/recieved
-GET/user/feed - Gets you the profile of the other users on platform 

Status: ignored, interested, accepted, rejected