#!/usr/bin/env bash
if [[ $EUID -ne 0 ]]; then
   >&2 echo "Error: this script must be run as root"
   exit 1
fi
if ! which "ansible" 2>&1 >/dev/null; then
    >&2 echo "Error: ansible is not installed. Please run 'pip3 install -U ansible'"
    exit 2
fi

export ANSIBLE_LOCALHOST_WARNING=False
export ANSIBLE_NOCOWS=1

SCRIPT_DIR=$(cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd)
pushd $SCRIPT_DIR
ansible-playbook development_computer.yaml
popd
