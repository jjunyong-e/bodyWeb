<?php

$conn = mysqli_connect('localhost',
    'root',
    'grom0419',
    'BodyWebDB');

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

//db에 값 입력

if (isset($_POST['infoSubmit'])) {
    mysqli_query($conn, "INSERT INTO userBodyData (age, sex, height,weight,inseam,armLength,shoulderLength,chestCirc,waistCirc,hipCirc,thighCirc,armCirc,calfCirc,headWidth) VALUES ($age,$sex,$height,$weight,$inseam,$armLength,$shoulderLength,$chestCirc,$waistCirc,$hipCirc,$thighCirc,$armCirc,$calfCirc,$headWidth)");

//
}

