/* IIFE builds dino and human objects and returns a function to handle the submit event.
On form submission, the returned function generates html for each object and injects it into the document to create the grid */

const createGrid = (function() {

    // JSON array of objects that represent different dinosaurs
    let dinos = [{"species":"Triceratops","weight":13000,"height":114,"diet":"herbavor","where":"North America","when":"Late Cretaceous","fact":"First discovered in 1889 by Othniel Charles Marsh"},{"species":"Tyrannosaurus Rex","weight":11905,"height":144,"diet":"carnivor","where":"North America","when":"Late Cretaceous","fact":"The largest known skull measures in at 5 feet long."},{"species":"Anklyosaurus","weight":10500,"height":55,"diet":"herbavor","where":"North America","when":"Late Cretaceous","fact":"Anklyosaurus survived for approximately 135 million years."},{"species":"Brachiosaurus","weight":70000,"height":"372","diet":"herbavor","where":"North America","when":"Late Jurasic","fact":"An asteroid was named 9954 Brachiosaurus in 1991."},{"species":"Stegosaurus","weight":11600,"height":79,"diet":"herbavor","where":"North America, Europe, Asia","when":"Late Jurasic to Early Cretaceous","fact":"The Stegosaurus had between 17 and 22 seperate places and flat spines."},{"species":"Elasmosaurus","weight":16000,"height":59,"diet":"carnivor","where":"North America","when":"Late Cretaceous","fact":"Elasmosaurus was a marine reptile first discovered in Kansas."},{"species":"Pteranodon","weight":44,"height":20,"diet":"carnivor","where":"North America","when":"Late Cretaceous","fact":"Actually a flying reptile, the Pteranodon is not a dinosaur."},{"species":"Pigeon","weight":0.5,"height":9,"diet":"herbavor","where":"World Wide","when":"Holocene","fact":"All birds are living dinosaurs."}];

    // Constructs dinosaur objects
    function Animal(species, weight, height, diet, where, when, fact) {
        this.species = species;
        this.weight = weight;
        this.height = height;
        this.diet = diet;
        this.where = where;
        this.when = when;
        this.fact = fact;
        this.image = this.getImageUrl();
    }

    Animal.prototype = {
        // Returns a string that represents the file path to the image of the object
        getImageUrl: function() {
            return "./images/" + this.species.toLowerCase().split(" ").join("") + ".png";
        },

        // Computes weight difference between the object and human and returns a string explaining the difference
        compareWeight: function() {
            const result =
                this.weight > human.weight
                ? "Weighs " + (this.weight - human.weight).toLocaleString() + "lbs more than you."
                : "Weighs " + (human.weight - this.weight).toLocaleString() + "lbs less than you.";
            return result;
        },

        // Computes height difference between the object and human and returns a string explaining the difference
        compareHeight: function() {
            const result =
                this.height > human.height
                ? "Is " + (this.height - human.height).toLocaleString() + " inches taller than you."
                : "Is " + (human.height - this.height).toLocaleString() + " inches shorter than you.";
            return result;
        },

        compareDiet: function() {
            return "Eats the " + this.diet + " diet.";
        },

        // Used to display a random fact about the object. Returns a string with a random fact.
        getFact: function() {
            const randomFact = Math.floor(Math.random() * 4);
            switch (randomFact) {
                case 0:
                    return this.compareWeight();
                    break;
                case 1:
                    return this.compareHeight();
                    break;
                case 2:
                    return this.compareDiet();
                    break;
                case 3:
                    return this.fact;
          }
        },

        // Generates html grid item for the object. Returns a string
        createTile: function() {
            const name =
                this.species === "Human"
                ? "<h3>" + this.name + "</h3>"
                : "<h3>" + this.species + "</h3>";
            const image = '<img src="' + this.getImageUrl() + '">';
            const fact =
                this.species === "Human"
                ? ""
                : this.species === "Pigeon"
                ? "<p>" + this.fact + "</p>"
                : "<p>" + this.getFact() + "</p>";

            return '<div class="grid-item">' + name + image + fact + '</div>';
        }
    };

    // Returns an array of dinos using the Animal constructor for each dino object in the JSON array
    const animals = dinos.map(function (obj) {
        return new Animal(
            obj.species,
            obj.weight,
            obj.height,
            obj.diet,
            obj.where,
            obj.when,
            obj.fact
        );
    });

    // Create human object and set it's prototype. Uses prototype because human object needs to inherit the createTile method.
    const human = Object.create(Animal.prototype);
    human.species = "Human";

    // Mutates animal array by placing human object in the center
    animals.splice(4, 0, human);

    return function() {
        // Build the rest of the human object from the form data submitted
        const feet = Number(document.getElementById("feet").value);
        const inches = Number(document.getElementById("inches").value);
        human.name = document.getElementById("name").value;
        human.height = feet * 12 + inches;
        human.weight = Number(document.getElementById("weight").value);
        human.diet = document.getElementById("diet").value;

        // Show the Refresh Facts button
        document.getElementById('refresh-btn').style.display = "inline-block";

        // Stores html for each animal tile. All html injected will end up in this variable.
        let html = "";

        /* Loops through each animal object an generates a tile.
        Return value of method is a string of html that gets appended to the html variable */
        animals.forEach(function(animal) {
            html += animal.createTile();
        })

        // Hide the form on button click
        document.getElementById('dino-compare').style.display = "none";

        // Inject final html of all tiles into document
        document.getElementById('grid').innerHTML = html;
    }
}());


document.getElementById('dino-compare').addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent form from submitting
    createGrid();
});
document.getElementById('refresh-btn').addEventListener('click', createGrid);
