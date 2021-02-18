const passport = require("passport")
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const AuthorModel = require("../authors/schema")
const {authenticate} = require("./tools")

passport.use(
    "google",
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3001/authors/googleRedirect",
      },
      async (request, accessToken, refreshToken, profile, next) => {
        const newAuthor = {
          googleId: profile.id,
          name: profile.name.givenName,
          surname: profile.name.familyName,
          email: profile.emails[0].value,
          role: "User",
          refreshTokens: [],
        }
  
        try {
          const author = await AuthorModel.findOne({ googleId: profile.id })
  
          if (author) {
            const tokens = await authenticate(author)
            next(null, { author, tokens })
          } else {
            const createdAuthor = new AuthorModel(newAuthor)
            await createdAuthor.save()
            const tokens = await authenticate(createdAuthor)
            next(null, { author: createdAuthor, tokens })
          }
        } catch (error) {
          next(error)
        }
      }
    )
  )

passport.serializeUser(function(author,next){
   next(null,author)
})








