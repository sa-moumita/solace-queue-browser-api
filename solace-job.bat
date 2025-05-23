@echo off
echo This is the batch file. > log.txt
echo Current date and time: %date% %time% >> log.txt
echo Some other data: 123, abc, true >> log.txt
if [%2]==[] (
    C:\work\msa\solace\ws1\solace-samples-java-jcsmp\build\staged\bin\CustomQueueBrowse -h mr-connection-qzk92nm2y9z.messaging.solace.cloud:55555 -u solace-cloud-client@btp_is_em -w r9ov0bcvdp9ge8q5bkv7v03tc1 -x BASIC -q %1>> log.txt
) else (
    C:\work\msa\solace\ws1\solace-samples-java-jcsmp\build\staged\bin\CustomQueueBrowse -h mr-connection-qzk92nm2y9z.messaging.solace.cloud:55555 -u solace-cloud-client@btp_is_em -w r9ov0bcvdp9ge8q5bkv7v03tc1 -x BASIC -q %1 -k %2 -v %3>> log.txt
)