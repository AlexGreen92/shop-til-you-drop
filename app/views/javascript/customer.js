// $('#textarea1').val('New Text');
// M.textareaAutoResize($('#textarea1'));

// document.addEventListener('DOMContentLoaded', function () {
//     var elems = document.querySelectorAll('.tooltipped');
//     var instances = M.Tooltip.init(elems, options);
// });

// Or with jQuery

$(document).ready(function () {
    // $("#search-text").val();
    $("#search-btn").on("click", function () {
        // console.log("hello");
        var search = $("#textarea1").val()
        console.log(search);
        $.ajax({
            type: "GET",
            url: '/api/items/' + search,
            success: function (res) {
                $('.collection').empty();
                for (let i = 0; i < res.length; i++) {
                    let list = $('<li>').attr('class', 'collection-item searchable').attr('data-name', res[i].name).attr('data-price', res[i].dataPoints[0].value).html(`<h5>${res[i].name}</h5>`);
                    let cost = $('<h6>').html(res[i].dataPoints[0].value);
                    list.append(cost);
                    let calories = $('<h6>').html(res[i].dataPoints[1].value);
                    list.append(calories);
                    let protein = $('<h6>').html(res[i].dataPoints[2].value);
                    list.append(protein);
                    let fat = $('<h6>').html(res[i].dataPoints[3].value);
                    list.append(fat);
                    let carbs = $('<h6>').html(res[i].dataPoints[3].value);
                    list.append(carbs);
                    list.append('<a href="#!" class="secondary-content"><i class="material-icons">send</i></a>');
                    $('.collection').append(list);
                }
                // var items = res.findCompletedItemsResponse[0].searchResult[0].item;
                // var data = "";
                // for (var i = 0; i < results.data.Recipes.length; i++) {
                //     data += "<div>";
                //     data += "<img src='" + imageURL + "  '/>";
                //     data += "  " + cost + " - ";
                // };
                // $('.results').html(ins);
            }
        });

    });

    // arrow function will cause loss of functionality
    $(document).on('click', '.searchable', function() {
        $.ajax({
            type: "POST",
            url: '/api/orders/',
            data: {
                item: $(this).attr('data-name'),
                price: $(this).attr('data-price'),
                quantity: 1
            },
            success: (res) => {
                // intentionally empty
            }
        });
    })
});

// $('.tooltipped').tooltip();
// });