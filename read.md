#nodemon helps us keep track of our application for changes
##modularization
\*\*5 major file structure were created

controllers
contains all the functions of everything in our backend
**exports. the es5 way of exporting functions and all makes the function usable all over our application
**routes is where we use all our controllers \**.. for when they're not in the same directory
\*\* . the same directory the root folder
##..//from another folder
#{} for importing named exports  
const router = Router is basically giving the one with the variable
N:B => all imports should be at the top of all modules
Default exports in JavaScript allow a module to export a single value or entity as the default export. Unlike named exports, which allow you to export multiple values from a module, default exports allow you to export only one value per module
/api/V1 is a naming convention v1 is the version
##middlewares
*they are middlewares that we use throughout our application  
\*express.json
//req,req, next
//the next means go to the next function
//crypto middleware
//crypto is a random token generator that help to generate otp for for the forget password function
//bcrypt middle is a middleware used to hash the passwords
//token
**refresh token
**timed token  
\*\*the logout function is used to remove the refresh token from our database
##schema is a schema is a skeleton structure that represent the logical view of the database.it defines how the data is organized and how the relations among them are associated
\*\*the model folder represent the models in this application
