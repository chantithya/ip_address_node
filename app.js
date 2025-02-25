const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Blog = require('./models/blog');
const { result } = require('lodash');

// express app 
const app = express();

// connect to mongodb 
const dbURI = "mongodb+srv://dbUser123:dbUser123@nodetuts.aylur.mongodb.net/Node-tuts?retryWrites=true&w=majority&appName=Nodetuts";
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
        app.listen(3000, () => {
            console.log('Server is running on port 3000');
        });
    })
    .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// middleware & static files
app.use(express.static('public'));

// use(express. urlencoded({extended: true})) is added to the server code, it registers the middleware to handle URL-encoded data for all incoming requests.
app.use(express.urlencoded({extended: true}));

app.use(morgan('dev'));

// routes
app.get('/add-blog', (req, res) => {
    const blog = new Blog({
        title: 'new blog 3',
        snippet: 'about my new blog',
        body: 'more about my new blog'
    });
    blog.save()
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            console.log(err);
            res.status(500).send('Error saving blog');
        });
});

app.get('/all-blogs', (req, res) => {
    Blog.find()
    .then((result) => {
        res.send(result);
    })
    .catch((err) => {
        console.log(err);
    });
})

app.get('/single-blog', (req, res) => {
    Blog.findById('67bc3bb1c4a666c12031dcf1')
    .then((result) => {
        res.send(result);
    })
    .catch((err) => {
        console.log(err); 
    })
});


// routes
app.get('/', (req, res) => {
    // const blogs = [
    //     { title: 'chantithya', snippet: 'Lorem ipsum dolar sit amet consectetur' },
    //     { title: 'Mario finds stars', snippet: 'Lorem ipsum dolar sit amet consectetur' },
    //     { title: 'How to defind browser', snippet: 'Lorem ipsum dolar sit amet consectetur' },
    // ];
    // const title = 'Home';
    // const name = 'Chantithya';
    // res.render('index', { title, blogs, name });

    res.redirect('/blogs');
});


// blog route       
app.get('/blogs', (req, res) => {
    Blog.find()
    .then((result) => {
        res.render('index', {title: 'All Blogs', blogs: result})
    })
    .catch((err) => {
        console.log(err)
    })
});

app.post('/blogs', (req, res) => {
    const blog = new Blog(req.body);

    blog.save()
    .then((result) => {
        res.redirect('/blogs');
    })
    .catch((err) => {
        console.log(err);
    })
});

app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;

    Blog.findById(id)
    .then(result => {
        res.render('details', { blog: result, title: 'Blog details'})
    })
    .catch(err => {
        console.log(err);
    })

});


app.delete('/blogs/:id', (req, res) => {
    const id = req.params.id;

    Blog.findByIdAndDelete(id)
    .then(result => {
        res.json({redirect: '/blogs'});
    })
    .catch(err => {
        console.log(err);
    })
});

app.get('/about', (req, res) => {
    const title = 'About';
    const name = 'Chantithya';
    res.render('about', { title, name });
});

app.get('/about-us', (req, res) => {
    res.redirect('/about');
});

app.get('/blogs/create', (req, res) => {
    const title = 'Create Blog';
    const name = 'Chantithya';
    res.render('create', { title, name });
});

// 404 page 
app.use((req, res) => {
    res.status(404).render('404');
});