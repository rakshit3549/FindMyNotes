let dis_content = true;
const inputDev = document.getElementById("input-dev");
const switch_text = document.querySelector('.switch-text');
setupSwitch();

inputDev.addEventListener("click", function () {
    var inputField = document.getElementById("search");
    inputField.focus();
})

function getIcon(url) {
    var youtubePattern = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/;
    var gitHubRegex = /^(https?:\/\/)?(www\.)?github\.com\/.*/i;
    var imagePathPattern = /.*\.(png|jpg|jpeg)$/i;
    if (youtubePattern.test(url)) {
        return '▶️';
    } else if (imagePathPattern.test(url)) {
        return '📷';
    } else if (gitHubRegex.test(url)) {
        return '📷';
    } else return '📑';

}
function creatBlogLink(title, link) {
    if (title !== null && link !== null) {
        return '<a href="'
            + link['v'] + '"  target="_blank" >'
            + title['v'] + getIcon(link['v']) + '</a>';
    } else return null;
}

function creatSubLinks(urlString) {
    if (urlString['v'] !== null) {
        var html = "";
        var linkNo = 1;
        var urls = urlString['v'].match(/https?:\/\/\S+/g);
        if (urls) {
            html = urls.map(function (url) {
                var linkName = 'Link ' + linkNo++ + getIcon(url);
                return '<a href="' + url + '" target="_blank">' +
                    linkName + '</a><br>';
            }).join('');
        } else html = '<a href="' + urlString['v'] +
            '" target="_blank">' + 'Link' + getIcon(urlString['v']) + '</a><br>';
        return html;
    } else return 'No links';

}

function setupSwitch() {
    const spreadsheetId = '1QkX41onUjrmg6dUa8Zv1jYlpft858GjyE2ReyCN2_Uo'
    const sheetName = 'IMP_Links';
    fetch(`https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:json&sheet=${sheetName}`)
        .then(res => res.text())
        .then(text => {
            const json = JSON.parse(text.substring(47).slice(0, -2))
            const jsondata = json['table']["rows"];
            let lineNo = 1;
            let trHTML = '';
            for (var i = 1; i < jsondata.length; ++i) {
                var blogLink = creatBlogLink(jsondata[i]['c'][0], jsondata[i]['c'][1]);
                var subLinks = creatSubLinks(jsondata[i]['c'][2]);
                if (blogLink !== null) {

                    trHTML += '<tr><td class="col1" scope="row">' + (lineNo) +
                        '</td><td class="col2">' + blogLink +
                        '</td><td class="col3">' + subLinks +
                        '</td></tr>'
                        ;
                    ++lineNo;
                }
            }
            var tableContent = document.getElementById('tableContent');
            tableContent.innerHTML = trHTML;
            trHTML = '';

        }).then(() => {
            document.getElementById("table-container").style.visibility = "visible";
        }).then(() => {

            const rows = document.getElementById('tableContent')
                .getElementsByTagName('tr');

            let searchTimer;
            function filterTable() {

                clearTimeout(searchTimer);
                searchTimer = setTimeout(() => {
                    let foundMatch = false;
                    const searchQuery = document.getElementById('search').value.toLowerCase();

                    for (let i = 0; i < rows.length; i++) {
                        const row = rows[i];
                        const title = row.getElementsByTagName('td')[1].innerText.toLowerCase();
                        // const description = row.getElementsByTagName('td')[2].innerText.toLowerCase();

                        // if (tcode.includes(searchQuery) || description.includes(searchQuery)) {
                        if (title.includes(searchQuery)) {
                            row.style.display = '';
                            foundMatch = true;
                        } else {
                            row.style.display = 'none';
                        }
                    }
                    const table = document.getElementById('table');
                    table.style.display = foundMatch ? '' : 'none';
                }, 250);
            };

            const searchInput = document.getElementById('search');
            searchInput.addEventListener('input', filterTable);

        });

}



