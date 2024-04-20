import { exec } from "child_process"
exec("zokrates compute-witness --verbose -s abi/firstLevelAbi16.ts -i firstLevel16.program -o temp/out.wtns  -a \
825241648 65535 102089915919669791891416434 65535 20121221 65535 18002 65535 75270952935788 65535 403437602354535610279268 65535 91712288943205 65535 5261380 65535 18684475339271783 65535 19024 65535 22094 65535 3836682 65535 20220728 65535 0 0 \
825241649 65535 87361386279539 65535 19801129 65535 5587269 65535 4788005298140966501 65535 403437602354535610279268 65535 21780717380396388 65535 19777 65535 18772 65535 17747 65535 22094 65535 8012796 65535 20231122 65535 0 0 \
825241650 65535 102089915919669791891416434 65535 20050931 65535 21843 65535 345232271731 65535 403437602354535610279268 65535 21780717380396388 65535 19781 65535 19819171171689317 65535 17747 65535 22094 65535 9995214 65535 20220522 65535 0 0 \
825241651 65535 77401440742501 65535 20170430 65535 21835 65535 84041477156718 65535 403437602354535610279268 65535 21780717380396388 65535 19795 65535 19819171171689317 65535 19024 65535 22094 65535 7420056 65535 20220108 65535 0 0 \
825241652 65535 87361386279539 65535 20050110 65535 21843 65535 18973625287796591 65535 5002778372107494756 65535 21780717380396388 65535 87361386279539 65535 87361386279539 65535 18002 65535 22094 65535 849536 65535 20231204 65535 0 0 \
825241653 65535 1298230373 65535 20120801 65535 5587269 65535 75270952935788 65535 403437602354535610279268 65535 91712288943205 65535 5261380 65535 6130722095796646047537422757479 65535 17747 65535 22094 65535 505935 65535 20230626 65535 0 0 \
825241654 65535 1298230373 65535 19860324 65535 18002 65535 1336195041881138097767 65535 25809869225103542062966990180 65535 91712288943205 65535 5261380 65535 6130722095796646047537422757479 65535 17747 65535 22094 65535 8074336 65535 20231018 65535 0 0 \
825241655 65535 1298230373 65535 19910316 65535 18002 65535 18973625287796591 65535 403437602354535610279268 65535 91712288943205 65535 5261380 65535 87361386279539 65535 18002 65535 22094 65535 1347691 65535 20230519 65535 0 0 \
825241656 65535 102089915919669791891416434 65535 20190409 65535 18507 65535 75270952935788 65535 25809869225103542062966990180 65535 91712288943205 65535 5261380 65535 6130722095796646047537422757479 65535 18002 65535 22094 65535 3748773 65535 20220431 65535 0 0 \
825241657 65535 77401440742501 65535 19610314 65535 21319 65535 84041477156718 65535 5002778372107494756 65535 91712288943205 65535 19781 65535 6130722095796646047537422757479 65535 18002 65535 22094 65535 2669514 65535 20230423 65535 0 0 \
825241904 65535 102089915919669791891416434 65535 19840509 65535 18002 65535 1538676881407509230181 65535 25809869225103542062966990180 65535 91712288943205 65535 19795 65535 18684475339271783 65535 17747 65535 22094 65535 9183822 65535 20231216 65535 0 0 \
825241905 65535 102089915919669791891416434 65535 20040325 65535 21835 65535 23766435330159727 65535 5002778372107494756 65535 91712288943205 65535 19795 65535 6130722095796646047537422757479 65535 18002 65535 22094 65535 4550699 65535 20230601 65535 0 0 \
825241906 65535 1298230373 65535 20000522 65535 17217 65535 84041477156718 65535 5002778372107494756 65535 21780717380396388 65535 87361386279539 65535 19819171171689317 65535 17742 65535 22094 65535 6612711 65535 20231020 65535 0 0 \
825241907 65535 1298230373 65535 19610607 65535 18002 65535 4788005298140966501 65535 5002778372107494756 65535 91712288943205 65535 16979 65535 18684475339271783 65535 17477 65535 22094 65535 1318565 65535 20230925 65535 0 0 \
825241908 65535 77401440742501 65535 19550703 65535 5587269 65535 345232271731 65535 5002778372107494756 65535 21780717380396388 65535 87361386279539 65535 6130722095796646047537422757479 65535 17742 65535 22094 65535 4312151 65535 20220403 65535 0 0 \
825241909 65535 87361386279539 65535 20160527 65535 18507 65535 18973625287796591 65535 5002778372107494756 65535 91712288943205 65535 19795 65535 87361386279539 65535 17747 65535 22094 65535 1980201 65535 20230412 65535 0 0 \
20010101 21843 0 0 0 \
4 6 0 0 0 \
3 1 0 0 0", (error, stdout, stderr) => {
    if (error) {
        console.log(`error: ${error.message}`);
        return;
    }
    if (stderr) {
        console.log(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});


// import { exec } from "child_process"

// exec("zokrates compute-witness --verbose -s abi/firstLevelAbi16.ts --abi -i firstLevel16.program -o temp/out.wtns", (error, stdout, stderr) => {
//     if (error) {
//         console.log(`error: ${error.message}`);
//         return;
//     }
//     if (stderr) {
//         console.log(`stderr: ${stderr}`);
//         return;
//     }
//     console.log(`stdout: ${stdout}`);
// });
