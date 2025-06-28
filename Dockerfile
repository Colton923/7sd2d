FROM debian:stable-slim

# Install dependencies for LinuxGSM and 7D2D
RUN dpkg --add-architecture i386 && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
        ca-certificates \
        curl \
        wget \
        bzip2 \
        gzip \
        unzip \
        binutils \
        lib32gcc-s1 \
        lib32stdc++6 \
        libcurl4-gnutls-dev \
        libsdl2-2.0-0:i386 \
        jq \
        bsdmainutils \
        cpio \
        distro-info \
        expect \
        file \
        libxml2-utils \
        netcat-openbsd \
        pigz \
        python3 \
        telnet \
        tmux \
        uuid-runtime \
        xz-utils \
        bc \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user
RUN useradd -m -s /bin/bash sdtdserver
USER sdtdserver
WORKDIR /home/sdtdserver

# Install LinuxGSM
RUN wget -O linuxgsm.sh https://linuxgsm.sh && chmod +x linuxgsm.sh && bash linuxgsm.sh sdtdserver

# Install the 7D2D server using LinuxGSM
RUN ./sdtdserver auto-install

# --- MOD AND MAP INSTALLATION ---
# Copy mods, worlds, and prefabs
COPY --chown=sdtdserver:sdtdserver local_mods/Mods /home/sdtdserver/serverfiles/Mods
COPY --chown=sdtdserver:sdtdserver local_mods/Worlds /home/sdtdserver/serverfiles/Data/Worlds
COPY --chown=sdtdserver:sdtdserver local_mods/Prefabs /home/sdtdserver/serverfiles/Data/Prefabs

# Copy server configuration
COPY --chown=sdtdserver:sdtdserver sdtdserver.xml /home/sdtdserver/serverfiles/sdtdserver.xml

# Expose server ports
EXPOSE 26900/udp
EXPOSE 26901/udp
EXPOSE 26902/udp

# Set the entrypoint to the LinuxGSM script
ENTRYPOINT ["./sdtdserver"]

# The command to run when the container starts
CMD ["start"]