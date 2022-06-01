const { query } = require('express');
const express = require('express');
const app = express();

const { quotes } = require('./data');
const { getRandomElement } = require('./utils');

const PORT = process.env.PORT || 4001;

app.use(express.static('public'));

app.get('/api/quotes/random', (req, res, next)=>{
    const randomQuote = getRandomElement(quotes);
    res.send({
        quote: randomQuote
    });
})

app.get('/api/quotes', (req, res, next)=>{
    const personName = req.query.person;
    if (personName){
        const selectedQuotes = [];
        for (object of quotes){
            if (object.person == personName){
                selectedQuotes.push(object);
            }
        }
        res.send({
            quotes: selectedQuotes
        });
    }else{
        res.send({
            quotes: quotes
        });
    }
})

app.post('/api/quotes', (req, res, next)=>{
    const {quote, person} = req.query;
    const quoteId = quotes.length + 1;
    const newQuote = {
        id: quoteId,
        quote: quote,
        person: person,
        year: req.query.year
    }
    if(quote && person){
        quotes.push(newQuote);
        res.status(201).send({
            quote: newQuote
        });
    }else{
        res.status(400).send();
    }
});

app.put('/api/quotes/:id', (req, res, next)=>{
    const quoteId = req.params.id;
    const newQuote = req.query.quote;
    let editQuote = {};
    if(quoteId){
        for (object of quotes){
            if (object.id == quoteId){
                object.quote = newQuote;
                if(req.query.person){
                    object.person = req.query.person;
                }
                if(req.query.year){
                    object.year = req.query.year;
                }
                editQuote = object
            }  
        }
        res.send({
            quote: editQuote
        })
    }else{
        res.status(404).send();
    }       
});

app.delete('/api/quotes/:id', (req, res, next)=>{
    const quoteId = req.params.id;
    if(quoteId){
        for (object of quotes){
            if (object.id == quoteId){
                const quoteIndex = quotes.indexOf(object);
                quotes.splice(quoteIndex, 1);
            }
        }
        res.status(204).send();
    }else{
        res.status(404).send();
    }
});

app.listen(PORT, ()=>{
    console.log('Listening at port 4001')
})