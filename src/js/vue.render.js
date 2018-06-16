var vueRender = (function () {

    var
        vueList = [],
        data = {
            items: []
        };

    var genView = function (selector, getUrl, callback) {

        if (vueList.indexOf(selector) !== -1) throw "selector already exist";

        vueList.push(selector);

        $.get(getUrl).then(function (response) {

            data.items = shuffle(response);

            var app = new Vue({
                el: selector,
                data: data,
                methods: {},
                mounted: function () {
                    this.$nextTick(function () {
                        callback();
                    })
                }
            });
        });
    }

    function shuffle(array) {
        var currentIndex = array.length,
            temporaryValue, randomIndex;

        // While there remain elements to shuffle...
        while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }

        return array;
    }

    return {
        genView: genView
    }
})();