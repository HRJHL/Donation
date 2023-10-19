window.onload = function() {
    drawMap('#gis-container', '#image-container');
};

// 지도 그리기
function drawMap(mapTarget, imageTarget) {
    var width = 700; // 지도의 넓이
    var height = 700; // 지도의 높이
    var initialScale = 5500; // 확대시킬 값
    var initialX = -11900; // 초기 위치값 X
    var initialY = 4050; // 초기 위치값 Y
    var labels;

    // 팝업을 표시할 div 추가
    var popup = d3.select(mapTarget)
        .append('div')
        .attr('class', 'popup')
        .style('display', 'none')
        .style('position', 'absolute');

    // 클릭한 지역에 대한 이미지 및 설명을 표시할 div 컨테이너
    var imagePopup = d3.select(imageTarget).append('div')
        .attr('class', 'image-popup')
        .style('display', 'none')
        .style('position', 'relative');

    // 이미지를 표시할 요소 선택
    var image = imagePopup.append('img')
        .style('width', '700px'); // 이미지 크기 조정

    var imagePopup2 = imagePopup.append('div')
        .attr('class', 'image-popup')
        .style('display', 'none')
        .style('position', 'relative');
    
    var image2 = imagePopup2.append('img')
        .style('width', '700px'); // 이미지 크기 조정 

    var description = imagePopup.append('div')
        .attr('class', 'description');

    var projection = d3.geo
        .mercator()
        .scale(initialScale)
        .translate([initialX, initialY]);
    var path = d3.geo.path().projection(projection);
    var zoom = d3.behavior
        .zoom()
        .translate(projection.translate())
        .scale(projection.scale())
        .scaleExtent([height, 800 * height])
        .on('zoom', zoom);

    var svg = d3
        .select(mapTarget)
        .append('svg')
        .attr('width', width + 'px')
        .attr('height', height + 'px')
        .attr('id', 'map')
        .attr('class', 'map');

    var states = svg
        .append('g')
        .attr('id', 'states')
        .call(zoom);

    states
        .append('rect')
        .attr('class', 'background')
        .attr('width', width + 'px')
        .attr('height', height + 'px');

    // geoJson데이터를 파싱하여 지도그리기
    d3.json('json/korea.json', function(json) {
        states
            .selectAll('path') // 지역 설정
            .data(json.features)
            .enter()
            .append('path')
            .attr('d', path)
            .attr('id', function(d) {
                return 'path-' + d.properties.name_eng;
            })
            .on('mouseover', function(d) {
                var name = d.properties.name;
                var code = d.properties.code;
                if(name =="서울특별시"){
                    var popupContent = '서울입니다';
                }
                if(name =="경기도"){
                    var popupContent = '경기입니다';
                }
                if(name =="인천광역시"){
                    var popupContent = '인천입니다';
                }
                if(name =="강원도"){
                    var popupContent = '강원입니다';
                }
                if(name =="세종특별자치시"){
                    var popupContent = '세종입니다';
                }
                if(name =="충청북도"){
                    var popupContent = '충청입니다';
                }
                if(name =="충청남도"){
                    var popupContent = '충남입니다';
                }
                if(name =="대전광역시"){
                    var popupContent = '대전입니다';
                }
                if(name =="대구광역시"){
                    var popupContent = '대구입니다';
                }
                if(name =="전라북도"){
                    var popupContent = '전라입니다';
                }
                if(name =="전라남도"){
                    var popupContent = '전북입니다';
                }
                if(name =="광주광역시"){
                    var popupContent = '광주입니다';
                }
                if(name =="경상북도"){
                    var popupContent = '경상입니다';
                }
                if(name =="경상남도"){
                    var popupContent = '경남입니다';
                }
                if(name =="울산광역시"){
                    var popupContent = '울산입니다';
                }
                if(name =="부산광역시"){
                    var popupContent = '부산입니다';
                }
                if(name =="제주특별자치도"){
                    var popupContent = '제주입니다';
                }

                // 팝업 위치 설정
                var x = d3.event.pageX;
                var y = d3.event.pageY;

                // 팝업 내용 및 위치 적용
                popup.html(popupContent)
                    .style('left', x + 'px')
                    .style('top', y + 'px')
                    .style('display', 'block');
            })
            .on('click', function(d) {
                // 클릭한 지역에 대한 이미지 및 설명 표시
                var name = d.properties.name;
                displayImagePopup(name);
            })
            .on('mouseout', function() {
                // 마우스가 path에서 벗어날 때 팝업 숨기기
                popup.style('display', 'none');
            });

        labels = states
            .selectAll('text')
            .data(json.features) // 라벨 표시
            .enter()
            .append('text')
            .attr('transform', translateTolabel)
            .attr('id', function(d) {
                return 'label-' + d.properties.name_eng;
            })
            .attr('text-anchor', 'middle')
            .attr('dy', '.35em')
            .text(function(d) {
                return d.properties.name;
            });
    });

    // 텍스트 위치 조절 - 하드코딩으로 위치 조절을 했습니다.
    function translateTolabel(d) {
        var arr = path.centroid(d);
        if (d.properties.code == 31) {
            // 서울 경기도 이름 겹쳐서 경기도 내리기
            arr[1] +=
                d3.event && d3.event.scale
                    ? d3.event.scale / height + 20
                    : initialScale / height + 20;
        } else if (d.properties.code == 34) {
            // 충남은 조금 더 내리기
            arr[1] +=
                d3.event && d3.event.scale
                    ? d3.event.scale / height + 10
                    : initialScale / height + 10;
        }
        return 'translate(' + arr + ')';
    }

    function zoom() {
        projection.translate(d3.event.translate).scale(d3.event.scale);
        states.selectAll('path').attr('d', path);
        labels.attr('transform', translateTolabel);
    }

    var imagePath = 'img/ALR.png';
    image.attr('src', imagePath);
    imagePopup.style('display', 'block');
    var imagePath2 = 'img/opwa.png';
    image2.attr('src', imagePath2);
    imagePopup2.style('display', 'block');

    
    function displayImagePopup(name) {
        if(name =="서울특별시"){
            imageName = "a1";
        };
        if(name =="경기도"){
            imageName = "a2";
        };
        if(name =="인천광역시"){
            imageName = "a3";
        };
        if(name =="강원도"){
            imageName = "a4";
        };
        if(name =="세종특별자치시"){
            imageName = "a5";
        };
        if(name =="충청북도"){
            imageName = "a6";
        };
        if(name =="충청남도"){
            imageName = "a7";
        };
        if(name =="대전광역시"){
            imageName = "a8";
        };
        if(name =="대구광역시"){
            imageName = "a9";
        };
        if(name =="전라북도"){
            imageName = "a10";
        };
        if(name =="전라남도"){
            imageName = "a11";
        };
        if(name =="광주광역시"){
            imageName = "a12";
        };
        if(name =="경상북도"){
            imageName = "a13";
        };
        if(name =="경상남도"){
            imageName = "a14";
        };
        if(name =="울산광역시"){
            imageName = "a15";
        };
        if(name =="부산광역시"){
            imageName = "a16";
        };
        if(name =="제주특별자치도"){
            imageName = "a17";
        };
        var imagePath = 'img/'+imageName+'.png';
        var descriptionText = getDescription(name);

        // 이미지 소스 및 크기 설정
        image.attr('src', imagePath);

        // 설명 내용 설정
        description.html(descriptionText);

        // 이미지 표시 컨테이너를 보이게 설정
        imagePopup.style('display', 'block');
    }

    // 지역 이름에 따른 이미지 파일 이름 가져오기
    function getImageName(name) {
        var nameLowerCase = name.toLowerCase().replace(/\s/g, ''); // 공백 및 대문자 제거
        return 'a' + (json.features.findIndex(f => f.properties.name === name) + 1);
    }

    // 지역 이름에 따른 설명 가져오기
    function getDescription(name) {
        switch (name) {
            case "서울특별시":
                return '서울에 대한 설명입니다.';
            case "경기도":
                return '경기에 대한 설명입니다.';
            case "인천광역시":
                return '인천에 대한 설명입니다.';
            case "강원도":
                return '강원에 대한 설명입니다.';
            case "세종특별자치시":
                return '세종에 대한 설명입니다.';
            case "충청북도":
                return '충북에 대한 설명입니다.';
            case "충청남도":
                return '충남에 대한 설명입니다.';
            case "대전광역시":
                return '대전에 대한 설명입니다.';
            case "대구광역시":
                return '대구에 대한 설명입니다.';
            case "전라북도":
                return '전북에 대한 설명입니다.';
            case "전라남도":
                return '전남에 대한 설명입니다.';
            case "광주광역시":
                return '광주에 대한 설명입니다.';
            case "경상북도":
                return '경북에 대한 설명입니다.';
            case "경상남도":
                return '경남에 대한 설명입니다.';
            case "울산광역시":
                return '울산에 대한 설명입니다.';
            case "부산광역시":
                return '부산에 대한 설명입니다.';
            case "제주특별자치도":
                return '제주에 대한 설명입니다.';
            default:
                return '기본 설명입니다.';
        }
    }
}