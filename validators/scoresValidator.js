const Joi = require("joi");
const dbDebugger = require("debug")("app:db");

// const schema = Joi.object({
//     session: Joi.string().required().error(new Error("session cannot be empty and must be in the format xxxx/yyyy")),
//     term: Joi.string().required(),
//     className: Joi.string().required().valid("tamyidi", "rawdoh", "adonah", "awwal ibtidahi", "thaani ibtidahi", "thaalith ibtidahi", "raabi ibtidahi", 
//     "khaamis ibtidahi", "awwal idaadi", "thaani idaadi", "thaalith idaadi").error(new Error("please input a valid class name")),
//     subjects: function (studentClass) {
//         if (studentClass ==="tamyidi" || studentClass ==="adonah"|| studentClass ==="rawdoh") {
             
//             this.subjects = {
//                 hifz: Joi.object({
//                     test: Joi.number().required().min(0).max(40).error(new Error("test score must have a value from 0 - 40")),
//                     exam: Joi.number().required().min(0).max(60).error(new Error("eaxam score must have a value from 0 - 40")),
//                 }),
//                 hadith: Joi.object({
//                     test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                     exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//                 }),
//                 imlah: Joi.object({
//                     test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                     exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//                 }),
//                 khatu: Joi.object({
//                     test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                     exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//                 }),
//                 taajiyya: Joi.object({
//                     test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                     exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//                 }),
//                 adhkaar: Joi.object({
//                     test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                     exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//                 }),
//                 lugha: Joi.object({
//                     test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                     exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//                 }),
//             }    
//         }
    
//         else if (studentClass ==="awwal ibtidahi" || studentClass ==="thaani ibtidahi" || studentClass ==="thaalith ibtidahi" || studentClass ==="raabi ibtidahi" || studentClass ==="khaamis ibtidahi") {
             
//             this.subjects = {
//                 hifz: Joi.object({
//                     test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                     exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//                 }),
//                 hadith: Joi.object({
//                     test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                     exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//                 }),
//                 tadribaatuLugha: Joi.object({
//                     test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                     exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//                 }),
//                 fiqh: Joi.object({
//                     test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                     exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//                 }),
//                 tajweed: Joi.object({
//                     test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                     exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//                 }),
//                 tawheed: Joi.object({
//                     test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                     exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//                 }),
//                 lugha: Joi.object({
//                     test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                     exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//                 }),
//             }    
//         }
    
//         else if (studentClass ==="awwal idaadi" || studentClass ==="thaani idaadi"|| studentClass ==="thaalith idaadi") {
             
//              this.subjects = {
//                 hifz: Joi.object({
//                     test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                     exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//                 }),
//                 hadith: Joi.object({
//                     test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                     exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//                 }),
//                 nahw: Joi.object({
//                     test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                     exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//                 }),
//                 sarf: Joi.object({
//                     test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                     exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//                 }),
//                 qiraaha: Joi.object({
//                     test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                     exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//                 }),
//                 tafseer: Joi.object({
//                     test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                     exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//                 }),
//                 lugha: Joi.object({
//                     test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                     exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//                 }),
//                 tahbeer: Joi.object({
//                     test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                     exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//                 }),
//                     fiqh: Joi.object({
//                     test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                     exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//                 }),
//                     tadribaatuLugha: Joi.object({
//                     test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                     exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//                 }),
//             }    
//         }
//             // return schema.validate(studentClass);
//         }
// }).strict();

//  function validateClass(studentClass) {
//     if (studentClass ==="tamyidi" || studentClass ==="adonah"|| studentClass ==="rawdoh") {
         
//         return schema.subjects = {
//             hifz: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("test score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("eaxam score must have a value from 0 - 40")),
//             }),
//             hadith: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//             imlah: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//             khatu: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//             taajiyya: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//             adhkaar: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//             lugha: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//         }    
//     }

//     else if (studentClass ==="awwal ibtidahi" || studentClass ==="thaani ibtidahi" || studentClass ==="thaalith ibtidahi" || studentClass ==="raabi ibtidahi" || studentClass ==="khaamis ibtidahi") {
         
//         return schema.subjects = {
//             hifz: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//             hadith: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//             tadribaatuLugha: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//             fiqh: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//             tajweed: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//             tawheed: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//             lugha: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//         }    
//     }

//     else if (studentClass ==="awwal idaadi" || studentClass ==="thaani idaadi"|| studentClass ==="thaalith idaadi") {
         
//         return schema.subjects = {
//             hifz: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//             hadith: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//             nahw: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//             sarf: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//             qiraaha: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//             tafseer: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//             lugha: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//             tahbeer: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//                 fiqh: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//                 tadribaatuLugha: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 40")),
//             }),
//         }    
//     }
//         // return schema.validate(studentClass);
//     }



function addScoresValidation(scores) {
    if (scores.className ==="tamyidi" || scores.className ==="adonah"|| scores.className ==="rawdoh") {
                 
        subjectPerClass = {
            hifz: Joi.object({
                test: Joi.number().required().min(0).max(40).error(new Error("test score must have a value from 0 - 40")),
                exam: Joi.number().required().min(0).max(60).error(new Error("eaxam score must have a value from 0 - 60")),
            }).required().error(new Error("hifz score cannot be empty")),
            hadith: Joi.object({
                test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
                exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 60")),
            }).required().error(new Error("you have not inputted a score for hadith")),
            imlah: Joi.object({
                test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
                exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 60")),
            }).required().error(new Error("you have not inputted a score for imlah")),
            khatu: Joi.object({
                test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
                exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 60")),
            }).required().error(new Error("you have not inputted a score for khatu")),
            taajiyya: Joi.object({
                test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
                exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 60")),
            }).required().error(new Error("you have not inputted a score for taajiyya")),
            adhkaar: Joi.object({
                test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
                exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 60")),
            }).required().error(new Error("you have not inputted a score for adhkaar")),
            lugha: Joi.object({
                test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
                exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 60")),
            }).required().error(new Error("you have not inputted a score for lugha")),
        }    
    }

    else if (scores.className ==="awwal ibtidahi" || scores.className ==="thaani ibtidahi" || scores.className ==="thaalith ibtidahi" || studentClass ==="raabi ibtidahi" || studentClass ==="khaamis ibtidahi") {
         
        subjectPerClass = {
            hifz: Joi.object({
                test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
                exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 60")),
            }).required().error(new Error("hifz score cannot be empty")),
            hadith: Joi.object({
                test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
                exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 60")),
            }).required().error(new Error("you have not inputted a score for hadith")),
            tadribaatuLugha: Joi.object({
                test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
                exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 60")),
            }).required().error(new Error("you have not inputted a score for tadribaatuLugha")),
            fiqh: Joi.object({
                test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
                exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 60")),
            }).required().error(new Error("you have not inputted a score for fiqh")),
            tajweed: Joi.object({
                test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
                exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 60")),
            }).required().error(new Error("you have not inputted a score for tajweed")),
            tawheed: Joi.object({
                test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
                exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 60")),
            }).required().error(new Error("you have not inputted a score for tawheed")),
            lugha: Joi.object({
                test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
                exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 60")),
            }).required().error(new Error("you have not inputted a score for lugha")),
        }    
    }

    else if (scores.className ==="awwal idaadi" || scores.className ==="thaani idaadi"|| scores.className ==="thaalith idaadi") {
         
        subjectPerClass = {
            hifz: Joi.object({
                test: Joi.number().required().min(0).max(40).error(new Error("test score must have a value from 0 - 40")),
                exam: Joi.number().required().min(0).max(60).error(new Error("exam score must have a value from 0 - 60")),
            }).required().error(new Error("hifz score cannot be empty")),
            hadith: Joi.object({
                test: Joi.number().required().min(0).max(40).error(new Error("test score must have a value from 0 - 40")),
                exam: Joi.number().required().min(0).max(60).error(new Error("exam score must have a value from 0 - 60")),
            }).required().error(new Error("hadith score cannot be empty")),
            nahw: Joi.object({
                test: Joi.number().required().min(0).max(40).error(new Error("test score must have a value from 0 - 40")),
                exam: Joi.number().required().min(0).max(60).error(new Error("exam score must have a value from 0 - 60")),
            }).required().error(new Error("you have not inputted a score for nahw")),
            sarf: Joi.object({
                test: Joi.number().required().min(0).max(40).error(new Error("test score must have a value from 0 - 40")),
                exam: Joi.number().required().min(0).max(60).error(new Error("exam score must have a value from 0 - 60")),
            }).required().error(new Error("you have not inputted a score for sarf")),
            qiraaha: Joi.object({
                test: Joi.number().required().min(0).max(40).error(new Error("test score must have a value from 0 - 40")),
                exam: Joi.number().required().min(0).max(60).error(new Error("exam score must have a value from 0 - 60")),
            }).required().error(new Error("you have not inputted a score for qiraaha")),
            tafseer: Joi.object({
                test: Joi.number().required().min(0).max(40).error(new Error("test score must have a value from 0 - 40")),
                exam: Joi.number().required().min(0).max(60).error(new Error("exam score must have a value from 0 - 60")),
            }).required().error(new Error("you have not inputted a score for tafseer")),
            lugha: Joi.object({
                test: Joi.number().required().min(0).max(40).error(new Error("test score must have a value from 0 - 40")),
                exam: Joi.number().required().min(0).max(60).error(new Error("exam score must have a value from 0 - 60")),
            }).required().error(new Error("you have not inputted a score for lugha")),
            tahbeer: Joi.object({
                test: Joi.number().required().min(0).max(40).error(new Error("test score must have a value from 0 - 40")),
                exam: Joi.number().required().min(0).max(60).error(new Error("exam score must have a value from 0 - 60")),
            }).required().error(new Error("you have not inputted a score for tahbeer")),
                fiqh: Joi.object({
                test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
                exam: Joi.number().required().min(0).max(60).error(new Error("score must have a value from 0 - 60")),
            }).required().error(new Error("fiqh score cannot be empty")),
                tadribaatuLugha: Joi.object({
                test: Joi.number().required().min(0).max(40).error(new Error("score must have a value from 0 - 40")),
                exam: Joi.number().required().min(0).max(60).error(new Error("exam score must have a value from 0 - 60")),
            }).required().error(new Error("you have not inputted a score for tadribaatuLugha")),
        } 
    }   
    const schema = Joi.object({
        session: Joi.string().required().error(new Error("session cannot be empty and must be in the format xxxx/yyyy")),
        term: Joi.string().required(),
        className: Joi.string().required().valid("tamyidi", "rawdoh", "adonah", "awwal ibtidahi", "thaani ibtidahi", "thaalith ibtidahi", "raabi ibtidahi", 
        "khaamis ibtidahi", "awwal idaadi", "thaani idaadi", "thaalith idaadi").error(new Error("please input a valid class name")),
        subjects: subjectPerClass
    }).strict();
            
        
    // dbDebugger(schema.subjects)

    return schema.validate(scores);
}




module.exports = {
    addScoresValidation,
};




// function addScoresValidation(scores) {
//     const schema = Joi.object({
//         // admNo: Joi.string()
//         //     .required()
//         //     .regex(/^RSM+[0-9]{1,4}/)
//         //     .messages({ "string.pattern.base": "invalid admission number" }),
      
//         session: Joi.string().required().error(new Error("session cannot be empty and must be in the format xxxx/yyyy")),
//         term: Joi.string().required(),
//         className: Joi.string().required().valid("tamyidi", "rawdoh", "adonah", "awwal ibtidahi", "thaani ibtidahi", "thaalith ibtidahi", "roobi ibtidahi", 
//         "khamis ibtidahi", "awwal idaadi", "thaani idaadi", "thaalith idaadi").error(new Error("please input a valid class name")),
//         subjects:{
//             hifz: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("test score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("exam score must have a value from 0 - 60")),
//             }),
//             hadith: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("test score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("exam score must have a value from 0 - 60")),
//             }),
//             imlah: Joi.object({
//                 test: Joi.number().required().min(0).max(40).error(new Error("test score must have a value from 0 - 40")),
//                 exam: Joi.number().required().min(0).max(60).error(new Error("exam score must have a value from 0 - 60")),
//             }),
//         }
    
// }).strict();

//     return schema.validate(scores);
// }