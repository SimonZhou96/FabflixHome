/**
 * This example is following frontend and backend separation.
 *
 * Before this .js is loaded, the html skeleton is created.
 *
 * This .js performs three steps:
 *      1. Get parameter from request URL so it know which id to look for
 *      2. Use jQuery to talk to backend API to get the json data.
 *      3. Populate the data to correct html elements.
 */

/**
 * Retrieve parameter from request URL, matching by parameter name
 * @param target String
 * @returns {*}
 */

function getParameterByName(target) {
    // Get request URL
    let url = window.location.href;
    // Encode target parameter name to url encoding
    target = target.replace(/[\[\]]/g, "\\$&");

    // Ues regular expression to find matched parameter value
    let regex = new RegExp("[?&]" + target + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';

    // Return the decoded parameter value
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/**
 * Handles the data returned by the API, read the jsonObject and populate data into html elements
 * @param resultData jsonObject
 */

function handleResult(resultData) {

    console.log(resultData);
    console.log("handleResult: populating star info from resultData");

    // populate the star info h3
    // find the empty h3 body by id "star_info"
    let starInfoElement = jQuery("#star_info");

    // append two html <p> created to the h3 body, which will refresh the page
    starInfoElement.append("<p>Star Name: " + resultData[0]["star_name"] + "</p>" +
        "<p>Date Of Birth: " + resultData[0]["star_dob"] + "</p>");

    console.log("handleResult: populating movie table from resultData");

    // Populate the star table
    // Find the empty table body by id "movie_table_body"
    let movieTableBodyElement = jQuery("#single-star-body");

    // Concatenate the html tags with resultData jsonObject to create table rows
    for (let i = 0; i < Math.min(10, resultData.length); i++) {
        let rowHTML = "";
        rowHTML+="<div class='row'>";
            rowHTML+="<div class=\"col-md-6\">";
                rowHTML+='<h1><a href="/backendCode/single-star.html?id=' + resultData[i]['star_id'] + '">'
                    + resultData[i]["star_name"] +     // display star_name for the link text
                    '</a></h1>';
            // start to add list of stars
            if (resultData[i]["star_birth"]===null) {
                rowHTML+="<h3>"+"Secret"+"</h3>";
            } else {
                rowHTML+="<h3>"+resultData[i]["star_birth"]+"</h3>";
            }

            rowHTML+="</div>";
            rowHTML+="<div class=\"col-md-5\">";
                rowHTML += "<h1>" + resultData[i]["movie_rating"] + "  " + resultData[i]["movie_director"]+ "</h1>";
                rowHTML += "<h3>" + resultData[i]["movie_year"] + "</h3>";
            rowHTML+="</div>";
        rowHTML+="</div>";
        rowHTML+="<hr>";
        // Append the row created to the table body, which will refresh the page
        movieTableBodyElement.append(rowHTML);
    }
}

/**
 * Once this .js is loaded, following scripts will be executed by the browser\
 */

// Get id from URL
let starId = getParameterByName('id');

if (starId != null) {
    console.log("send the star request");
// Makes the HTTP GET request and registers on success callback function handleResult
    $.ajax({
        dataType: "json",  // Setting return data type
        method: "GET",// Setting request method
        data: {"id":starId},
        cache:false,
        url: "/backendCode/api/single-star?id=" +starId, // Setting request url, which is mapped by StarsServlet in Stars.java
        success: (resultData) => handleResult(resultData), // Setting callback function to handle data returned successfully by the SingleStarServlet
        error: (error)=> {console.log(error)}
    });
}