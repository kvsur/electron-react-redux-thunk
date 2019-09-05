@echo off

REM echo 1-d0 %~d0
 
REM echo 2-dp0 %~dp0
 
REM echo 3-f0 %~f0
 
REM echo 4-sdp0 %~sdp0
 
REM echo 5-cd %cd%

REM PROCESSOR_ARCHITECTURE 是获取系统是 x86 还是 AMD64 的参数，不同的系统是不同的7zip exe 文件进行解压操作
REM 两个7中的任何一个7都不能删除，涉及到batch 文件转义及参数问题
set unzip=%~dp0%77zip\%PROCESSOR_ARCHITECTURE%.exe

set jdkFilePath=%~dp0%jar\jdk.zip
set javaServicePath=%~dp0%jar\teaching-qa-collect.zip

set INSTDIR=.\

if exist %jdkFilePath% (goto jdkFound) else (goto jdkNotFound)

:jdkNotFound
echo "Not found jdk.zip file."

:jdkFound
%unzip% x %jdkFilePath% -y -aos -o%INSTDIR%

if exist %javaServicePath% (goto serviceFound) else (goto serviceNotFound)

:serviceNotFound
echo "Not found teaching-qa-collect.zip file."

:serviceFound
%unzip% x %javaServicePath% -y -aos -o%INSTDIR%

start %INSTDIR%teaching-qa-collect\bin\daemon.bat

exit
