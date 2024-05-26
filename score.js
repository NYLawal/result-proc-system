// let score =[ {
//         sessionName,
//         className,
//         firstTerm: [
//              {
//                 subjectName,
//                 testScore,
//                 examScore,
//                 totalScore,
//                 remark
//             },
//             comment
//         ],
//         secondTerm: [
//              {
//                 subjectName,
//                 testScore,
//                 examScore,
//                 totalScore,
//                 remark
//             },
//             comment
//         ],
//         thirdTerm: [
//              {
//                 subjectName,
//                 testScore,
//                 examScore,
//                 totalScore,
//                 remark
//             },
//             comment
//         ],

//     }
// ]
let sessionName
let className
let subjectName
let testScore
let totalScore
let examScore
let remark
let comment

let scores = [{
   sessionName: "2023/2024" ,
    className : "tamyidi",
    firstTerm: { 
        scores: [{subjectName:"fiqh", testScore:20, examScore:40,
        totalScore, remark:"v.good"}, {subjectName:"tawheed", testScore:30, examScore:50,
        totalScore, remark:"excellent"}],
        
        comment: "she is a hardworking student"
},
secondTerm: { 
    scores: [{subjectName:"fiqh", testScore:38, examScore:40,
          totalScore, remark}],
    
    comment: "she is a good girl"
},
thirdTerm: { 
    scores: [{subjectName:"fiqh", testScore:20, examScore:40,
          totalScore, remark}],
    
    comment: "she is a good girl"
},
}]
scores[0].firstTerm.scores[0].totalScore = scores[0].firstTerm.scores[0].testScore + scores[0].firstTerm.scores[0].examScore
console.log(scores[0].firstTerm.scores[0])

// scores[0].className = "tamyidi";
// console.log(scores[0].className);
// console.log(scores[0].sessionName = "2023/2024");
// console.log(scores[0].firstTerm[0].subjectName = "fiqh");
// console.log(scores[0].firstTerm[0].testScore = 30);
// console.log(score[0].firstTerm[0].examScore = 40);
// console.log(score[0].firstTerm[0].totalScore = score[0].firstTerm[0].testScore + score[0].firstTerm[0].examScore );
// console.log(score[0].firstTerm[0].remark = 30);
// console.log(score[0].comment = "she is a good girl");
