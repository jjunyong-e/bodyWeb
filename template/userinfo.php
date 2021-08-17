<?php
$host = "localhost";
$username = "root";
$password = "grom0419";
$database = "bodyWebDB";
$conn = mysqli_connect($host, $username, $password, $database);

//폼값 정의
$age = $_POST['age'];
$sex = $_POST['sex'];
$height = $_POST['height'];
$weight = $_POST['weight'];
$inseam = $_POST['inseam'];
$armLength = $_POST['armLength'];
$shoulderLength = $_POST['shoulderLength'];
$chestCirc = $_POST['chestCirc'];
$waistCirc = $_POST['waistCirc'];
$hipCirc = $_POST['hipCirc'];
$thighCirc = $_POST['thighCirc'];
$armCirc = $_POST['armCirc'];
$calfCirc = $_POST['calfCirc'];
$headWidth = $_POST['headWidth'];
$submit = $_POST['infoSubmit'];
//db에 값 입력

if (isset($submit)) {
    mysqli_query($conn, "INSERT INTO userBodyData (age, gender, height,weight,inseam,armLength,shoulderLength,chestCirc,waistCirc,hipCirc,thighCirc,armCirc,calfCirc,headWidth) VALUES ('$age','$sex','$height','$weight','$inseam','$armLength','$shoulderLength','$chestCirc','$waistCirc','$hipCirc','$thighCirc','$armCirc','$calfCirc','$headWidth')");

//
}

