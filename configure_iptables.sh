#!/bin/bash
sudo iptables --flush
sudo iptables --table nat --flush
sudo iptables --delete-chain
sudo iptables -A INPUT -p tcp --dport 22 -j ACCEPT
sudo iptables -A OUTPUT -p tcp --sport 22 -j ACCEPT
sudo iptables -t nat -A OUTPUT -p tcp --dport 53 -j DNAT --to 8.8.8.8
sudo iptables -t nat -A OUTPUT -p udp --dport 53 -j DNAT --to 8.8.8.8
sudo iptables --table nat --append POSTROUTING --out-interface eth0 -j MASQUERADE
sudo iptables --append FORWARD --in-interface eth1 -j ACCEPT
sudo iptables -t nat -A PREROUTING -s 192.168.56.0/24 -p tcp -m multiport --dports 80,443,21 -j DNAT --to-destination 192.168.56.1:8082
sudo service ufw restart
