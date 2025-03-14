# ECE 158B: Data Networks
---
This class is about software implementation of network systems and applications. We had hands-on measurement and implementation of network protocols (link layer, IP layer, and transport layer) and experimented with state-of-the-art network architectures and applications. 
It covers the following topics: network programming over TCP/UDP sockets; application-layer protocols (DNS, HTTP, P2P); multimedia protocols (video streaming, VoIP, video telephony, virtual reality); data center networking and cloud computing; software-defined networking; network security.

This post explores foundational and advanced networking topics, diving into the structure and operation of modern networks. From the underlying architecture of the Internet to the complexities of network security and mobility, each section explains why these concepts matter and how they are used in the real world.

---

## Module 1: Overview

### 1. Structure of the Internet

- **Hierarchical Structure**  
  The Internet is organized into a hierarchical model where large, global networks—known as Tier-1 ISPs—form the backbone, interconnecting with regional Tier-2 and local Tier-3 ISPs. This structure ensures scalability and efficient routing: Tier-1 providers peer with each other to facilitate global traffic exchange, while lower-tier ISPs connect to these backbones to serve regional customers. The hierarchy allows for clear delineation of responsibilities and cost structures, making it possible to manage and upgrade parts of the network without impacting the whole system.

- **End-to-End Structure**  
  In contrast to the physical and organizational hierarchy, the end-to-end principle describes how individual devices (or end hosts) communicate directly with each other using a layered protocol stack. Each device operates independently and relies on the collective cooperation of network layers—ranging from the application to the physical layer—to deliver data accurately and reliably. This approach is central to the Internet’s design, as it provides robustness, enables innovation at the edge, and allows for a diverse range of applications and services.

### 2. High-Level Architecture of Different Networks

- **Home Network**  
  A home network is typically built around a wireless router and modem that connect various devices such as computers, smartphones, and smart appliances. This architecture emphasizes ease of use, affordability, and simplicity, making it accessible for everyday tasks like web browsing and streaming. While home networks are relatively simple, they are crucial for providing secure access to the Internet and enabling smart home technologies.

- **Enterprise Network**  
  Enterprise networks are more complex, incorporating layers of security and management through firewalls, Virtual Private Networks (VPNs), load balancers, and managed switches. These networks are designed to handle high volumes of data and support a multitude of users and applications. They prioritize reliability, security, and performance, which are essential for business operations, data integrity, and regulatory compliance.

- **Broadband Cellular Network**  
  Cellular networks use a combination of base stations, backhaul links, and a core network to deliver mobile connectivity. These networks are engineered to support a large number of users over wide geographic areas, emphasizing mobility and seamless handoffs as users move between cells. Their architecture incorporates advanced techniques like frequency reuse and adaptive modulation to handle interference and provide consistent service quality even in dense urban environments.

### 3. Web Request Workflow

- **Application Layer**  
  At the top of the networking stack, the application layer handles the details of user interactions. When you visit a website, your browser issues an HTTP request that specifies the resource you want to access. This layer translates human-readable URLs into protocol-specific requests and responses, ensuring that data is formatted correctly for further processing by lower layers.

- **Transport Layer**  
  The transport layer, typically using TCP (Transmission Control Protocol), establishes a reliable connection between the client and server. TCP breaks down the data into packets, ensures they are transmitted reliably, and reassembles them at the destination. This layer’s mechanisms—such as error checking, packet ordering, and congestion control—are essential for applications where data integrity and order are critical.

- **Network Layer**  
  Responsible for routing, the network layer uses IP (Internet Protocol) to direct packets through a series of interconnected networks. Each packet is stamped with source and destination IP addresses, allowing routers to determine the best path for the data. This dynamic routing capability is fundamental to the scalability and flexibility of the Internet, adapting to changes in network topology and traffic conditions.

- **Link Layer**  
  The link layer manages local data transfer over physical media like Ethernet or Wi-Fi. It encapsulates IP packets into frames for transmission over a specific medium and handles tasks such as error detection and MAC addressing. By managing the intricacies of physical connectivity, this layer ensures that data is accurately transferred within local networks before being forwarded to higher layers.

### 4. Transport, IP, and Link Layer Protocols

- **TCP Congestion Control**  
  TCP congestion control algorithms dynamically adjust the rate at which data is sent to avoid overwhelming the network. Techniques like slow start, congestion avoidance, and fast recovery help maintain network stability even during peak traffic. This adaptive approach is vital for minimizing packet loss and ensuring efficient utilization of network resources.

- **IP Address Allocation**  
  IP address allocation, often managed by DHCP (Dynamic Host Configuration Protocol), assigns unique network addresses to devices as they join the network. This automated process simplifies network management and ensures that each device can communicate reliably. Efficient address allocation is key to supporting large-scale networks where manual configuration would be impractical.

- **Network Address Translation (NAT)**  
  NAT enables multiple devices on a private network to share a single public IP address. By translating private addresses to a public one, NAT conserves IP address space and adds a layer of security by masking internal network structures. This mechanism is particularly useful in home and enterprise environments where the number of devices exceeds available public IP addresses.

- **Hierarchical Routing**  
  Hierarchical routing breaks down the routing process into multiple layers, each responsible for a portion of the overall network. By aggregating routing information and reducing the size of routing tables, this method enhances scalability and efficiency. It allows routers to make faster decisions and simplifies network management in large, complex infrastructures.

- **Address Resolution Protocol (ARP)**  
  ARP is used to map IP addresses to physical MAC addresses within a local network. When a device wants to communicate with another, ARP resolves the recipient’s MAC address to ensure that data reaches the correct hardware. This process is fundamental for proper communication on Ethernet and other link-layer technologies.

- **Ethernet Switching**  
  Ethernet switches use MAC addresses to forward data frames within a local area network. By learning and maintaining a table of connected devices, switches can reduce unnecessary traffic and improve overall network performance. This method enhances security and efficiency by ensuring that data is only sent to the intended recipient.

### 5. TCP vs. UDP Socket Programming

- **TCP Socket Programming**  
  TCP is a connection-oriented protocol that guarantees data delivery, correct sequencing, and error recovery. When you program using TCP sockets, you set up a reliable communication channel where the sender and receiver maintain an ongoing dialogue. This reliability is crucial for applications like file transfers, web browsing, and email, where every bit of data must be accurately received.

- **UDP Socket Programming**  
  UDP is a connectionless protocol that emphasizes speed over reliability. It is well-suited for applications where low latency is more critical than error correction, such as live video streaming, online gaming, or voice over IP (VoIP). By eliminating the overhead of connection management, UDP minimizes delay, although it does not guarantee delivery or order.

---

## Module 2: Network Applications

### 1. Application-Specific Transport Layer Choices

Different applications have unique quality of service requirements that influence the choice between TCP and UDP. For example, streaming applications often use UDP because its low latency is essential for real-time performance, even if it means accepting occasional packet loss. In contrast, web applications rely on TCP’s reliability to ensure that every part of a web page is delivered intact, providing a consistent user experience despite fluctuations in network conditions.

### 2. P2P vs. Client/Server Architecture

- **P2P Architecture**  
  Peer-to-peer (P2P) networks distribute workloads among all participants, with each peer acting as both a client and a server. This decentralized approach enhances scalability and resilience, as there is no single point of failure. However, P2P systems can be more complex to design and manage due to dynamic peer participation and the need for efficient resource discovery and data consistency mechanisms.

- **Client/Server Architecture**  
  In contrast, client/server architectures centralize resources on dedicated servers that respond to requests from clients. This model simplifies management, as the servers handle data processing and storage, but it can become a bottleneck if too many clients attempt to access the server simultaneously. The centralized control, however, allows for easier implementation of security policies and maintenance procedures.

### 3. Web Page Structure and HTTP

Modern web pages are constructed using HTML, CSS, and JavaScript, which define both the content and its presentation. The HTTP protocol governs the exchange of these resources between web browsers and servers. This separation of content and presentation, combined with HTTP’s request-response model, enables rapid and flexible web development, facilitating everything from static websites to dynamic, interactive applications.

### 4. Stateless vs. Stateful Protocols

- **Stateless Protocols**  
  Stateless protocols, like HTTP, treat each request as an independent transaction with no stored context. This simplicity leads to easier scaling and reduced server overhead, as the server does not need to maintain session information between requests. However, the lack of context can complicate scenarios that require continuity, such as user sessions or multi-step transactions.

- **Stateful Protocols**  
  Stateful protocols maintain context across multiple interactions, which is beneficial for applications that require persistent sessions, like FTP or WebSockets. While this approach can offer improved performance and user experience through session persistence, it also requires more complex server management and resources to track the state of each connection.

### 5. Persistent vs. Non-Persistent HTTP

- **Persistent HTTP**  
  With persistent HTTP, a single TCP connection is reused for multiple HTTP requests and responses. This approach reduces the overhead associated with repeatedly establishing and tearing down connections, thereby improving latency and resource utilization. Persistent connections are especially advantageous when loading complex web pages that require many small resources.

- **Non-Persistent HTTP**  
  Non-persistent HTTP opens a new TCP connection for each HTTP request. Although simpler in concept, this method incurs additional overhead and delays, particularly when multiple resources are needed. The performance trade-offs have led most modern web applications to favor persistent connections.

### 6. HTTP Cookies

HTTP cookies are small pieces of data stored on a client’s device by a web server. They allow servers to maintain state across stateless HTTP transactions by storing session information, user preferences, or tracking data. This mechanism is crucial for enabling personalized user experiences, managing logins, and tracking user behavior, despite the underlying stateless nature of the HTTP protocol.

### 7. Web Caching Benefits

Web caching involves storing copies of frequently requested resources closer to the user, either on the client side, at an ISP, or on dedicated caching servers. By reducing the need to repeatedly fetch data from the origin server, caching significantly decreases latency and reduces network congestion. This results in faster load times and more efficient use of bandwidth, improving the overall user experience.

### 8. FTP Control/Data Separation

File Transfer Protocol (FTP) separates the control channel (used for sending commands) from the data channel (used for transferring files). This design allows for simultaneous management of commands and bulk data transfer, leading to more efficient error handling and resource allocation. The separation also facilitates the use of different security measures and connection types for control and data, optimizing overall performance.

### 9. Email Workflow

Email systems are built on a layered protocol architecture where SMTP is used for sending messages and protocols like IMAP or POP are used for retrieving them. The workflow typically involves composing an email, relaying it through various mail servers, and finally delivering it to the recipient’s mailbox. This process not only ensures reliable message delivery but also supports features such as spam filtering, attachment handling, and user authentication.

### 10. DNS Name Resolution

The Domain Name System (DNS) functions like the Internet’s phonebook, translating human-friendly domain names into numerical IP addresses that computers use to identify each other. By providing a hierarchical and distributed lookup service, DNS simplifies user interactions with the Internet and supports load distribution and redundancy, which are essential for large-scale web services.

### 11. P2P and BitTorrent

BitTorrent, a popular P2P file-sharing protocol, divides large files into smaller chunks that can be downloaded concurrently from multiple peers. This chunk-based distribution method not only speeds up downloads but also reduces the burden on any single server. Key mechanisms like tit-for-tat encourage fair sharing among users, ensuring that peers contribute upload bandwidth in exchange for receiving data, thereby creating a balanced ecosystem.

### 12. Distributed Hash Tables (DHT)

DHTs are decentralized systems that provide efficient lookup services by mapping keys to values across a network of nodes. They offer a robust solution for scalable resource discovery without the need for a central directory. This decentralized approach is particularly valuable in P2P networks and distributed applications, where resilience to node failures and dynamic membership are critical.

### 13. Web Caching vs. CDN

While web caching typically involves storing copies of frequently accessed data locally or at a network edge, Content Delivery Networks (CDNs) take this concept to a global scale. CDNs distribute content across numerous geographically dispersed servers, which reduces latency, improves load times, and provides redundancy. This distributed approach is essential for handling high traffic volumes and ensuring a consistent user experience worldwide.

---

## Module 3: Multimedia Networking

### 1. Video Streaming Mechanisms

Video streaming relies on two key buffering mechanisms. **Initial buffering** preloads a segment of the video before playback begins, which helps mitigate initial delays and jitter. **Playout buffering**, on the other hand, continuously stores incoming data to compensate for variations in network speed, ensuring smooth playback. Both techniques are critical in maintaining quality of service for streaming applications, especially under fluctuating network conditions.

### 2. UDP vs. TCP for Video Streaming

UDP is often preferred for live streaming and real-time communication because it minimizes delay by forgoing the overhead of connection establishment and error recovery. This results in lower latency, although it means that some packets may be lost without retransmission. Conversely, TCP provides a reliable, ordered stream of data, which is beneficial for pre-buffered video content where quality and integrity are paramount, even though this can introduce delays due to its retransmission mechanisms.

### 3. DASH vs. Custom Streaming

Dynamic Adaptive Streaming over HTTP (DASH) represents an evolution from traditional streaming methods by dynamically adjusting the video bitrate based on real-time network conditions. This adaptability helps prevent buffering and quality degradation during periods of variable bandwidth. Compared to custom streaming solutions that may use fixed bitrates or proprietary protocols, DASH offers greater compatibility, flexibility, and a better user experience under diverse network environments.

### 4. CDN for Multimedia

CDNs play an essential role in multimedia delivery by caching video and audio content on servers located near end users. This proximity minimizes latency and reduces the load on central servers during high-demand events. By intelligently redirecting user requests to the nearest edge server, CDNs ensure that content is delivered quickly and reliably, which is especially important for high-bandwidth multimedia applications.

### 5. VoIP with SIP

Voice over IP (VoIP) applications rely on the Session Initiation Protocol (SIP) to set up, modify, and terminate calls over the Internet. SIP is designed to handle mobility and changing network conditions, making it ideal for users who move between networks. Its role in establishing sessions and negotiating media parameters ensures that voice communications are maintained even when the underlying IP addresses change.

### 6. Skype Architecture and NAT Traversal

Skype’s architecture leverages a combination of supernodes and relay servers to enable direct communication between users, even when they are behind firewalls or NAT devices. This design facilitates NAT traversal, allowing users on different networks to connect seamlessly. The use of decentralized supernodes not only distributes the network load but also enhances robustness by eliminating a single point of failure.

### 7. WebRTC and GCC Congestion Control

WebRTC enables real-time audio, video, and data sharing directly between browsers without the need for plugins. Its built-in Google Congestion Control (GCC) algorithm continuously monitors network conditions and dynamically adjusts the sending rate to balance throughput and delay. This adaptive congestion control is crucial for maintaining high-quality, interactive communications in environments with varying network performance.

### 8. Traffic Scheduling Algorithms

- **FIFO (First-In-First-Out)**  
  FIFO is a simple scheduling algorithm that processes packets in the order they arrive. Its simplicity makes it easy to implement, but it does not differentiate between high- and low-priority traffic, which can be a disadvantage in congested networks.

- **Priority Scheduling**  
  This algorithm assigns different priority levels to packets, ensuring that critical or time-sensitive data is transmitted first. While this improves performance for high-priority traffic, it can lead to starvation of lower-priority packets if not managed correctly.

- **Round-Robin Scheduling**  
  Round-robin scheduling cycles through packets or flows in a fixed order, ensuring fair distribution of network resources. This method prevents any single flow from monopolizing bandwidth, although it might not be optimal for flows with varying bandwidth requirements.

- **Weighted Fair Queuing (WFQ)**  
  WFQ assigns weights to different traffic flows based on their requirements, allowing for proportional bandwidth allocation. This algorithm offers a balance between fairness and performance, ensuring that each flow receives its appropriate share of the network capacity while maintaining overall efficiency.

---

## Module 4: Data Center Networking and SDN

### 1. Data Center Traffic Patterns

Data centers experience highly bursty and often synchronized traffic due to parallel computing tasks and distributed applications. This traffic pattern can lead to sudden spikes in demand on particular network links. Understanding these patterns is crucial for designing data center networks that can dynamically allocate resources and avoid bottlenecks, ultimately ensuring high performance and scalability.

### 2. Scale-Up vs. Scale-Out

- **Scale-Up (Vertical Scaling)**  
  Scale-up strategies involve enhancing the capacity of existing hardware—such as increasing CPU power or memory—to meet growing demands. This approach can simplify management and is effective when workloads are confined to a single system, but it has limits in terms of hardware capabilities and cost.

- **Scale-Out (Horizontal Scaling)**  
  Scale-out involves adding more hardware units, such as additional servers or switches, to distribute the load. This method provides nearly limitless expansion and improves redundancy; however, it requires more complex coordination and management, particularly in ensuring efficient communication between distributed components.

### 3. Load Balancing Limitations

In data centers, load balancing can be implemented on a per-packet or per-flow basis, each with its own set of challenges. Per-packet load balancing may result in packets arriving out of order, while per-flow load balancing can lead to uneven distribution if some flows are significantly larger than others. Recognizing these limitations helps network designers develop hybrid solutions that optimize traffic distribution and minimize latency.

### 4. Topology-Aware Addressing and Centralized Source Routing

Topology-aware addressing assigns IP addresses based on the physical or logical layout of the network. This method simplifies routing decisions and improves the efficiency of packet delivery. In centralized source routing, a central controller determines the optimal path for each packet, which can lead to improved performance and easier troubleshooting. However, the reliance on a central point also necessitates robust failover strategies to maintain network resilience.

### 5. DC-TCP and pFabric

- **DC-TCP**  
  DC-TCP is a congestion control algorithm specifically designed for data center environments. It optimizes throughput and minimizes latency by adapting quickly to the rapid changes in traffic typical of these settings. Although effective, it can sometimes struggle with fairness in the presence of highly variable flows.

- **pFabric**  
  pFabric simplifies the packet scheduling process by prioritizing packets based on flow characteristics, often favoring shorter flows to reduce overall latency. By streamlining the scheduling process, pFabric minimizes delay and improves efficiency, offering a compelling alternative to traditional congestion control mechanisms in data centers.

### 6. Software-Defined Networking (SDN)

SDN represents a paradigm shift by decoupling the network’s control plane from its data plane. This separation allows network administrators to manage and reconfigure the network centrally, leading to increased flexibility and faster deployment of new services. SDN also enables network virtualization, where multiple virtual networks share the same physical infrastructure, resulting in better resource utilization and simplified management in complex, dynamic environments.

---

## Module 5: Network Security

### 1. Security Principles

At the heart of network security lie three core principles: confidentiality, integrity, and authentication. **Confidentiality** ensures that sensitive data remains accessible only to authorized users. **Integrity** protects data from unauthorized alteration during transmission, while **authentication** verifies the identities of communicating parties. Together, these principles create a robust framework that underpins secure communications across all types of networks.

### 2. Symmetric Key Cryptography

Symmetric key cryptography uses a single, shared secret for both encryption and decryption. Its main advantage is speed, which makes it ideal for encrypting large amounts of data. However, the challenge of securely distributing and managing the secret key, especially over insecure channels, means that symmetric cryptography is often used in conjunction with other security measures to establish initial trust.

### 3. Public Key Cryptography

Public key cryptography, such as RSA, utilizes a pair of mathematically related keys—a public key for encryption and a private key for decryption. This method enables secure communication over open networks and is fundamental for digital signatures and certificate-based authentication. Its strength lies in the mathematical complexity that makes it computationally infeasible to derive the private key from the public one, ensuring secure key exchange and data integrity.

### 4. Authentication Protocols

Authentication protocols verify the identities of users and devices before granting access to network resources. These protocols range from simple password-based systems to sophisticated multi-factor authentication and digital certificate schemes. Each method comes with its advantages and vulnerabilities, and choosing the right one depends on the required security level, ease of use, and the potential impact of a breach.

### 5. Digital Signatures

Digital signatures leverage public key cryptography to verify the origin and integrity of a message or document. By generating a unique signature based on the content and a private key, the sender ensures that any subsequent modification can be detected by the recipient using the corresponding public key. This process not only establishes trust but also provides non-repudiation, meaning that the sender cannot later deny the authenticity of the signed data.

### 6. Email Security

Email security combines encryption, digital signatures, and spam filtering to protect communications from unauthorized access and tampering. By encrypting messages, only the intended recipient can read the content; digital signatures ensure the message’s integrity; and spam filters help prevent phishing and malware distribution. This layered approach is essential for safeguarding sensitive information in both personal and professional contexts.

### 7. Firewalls

Firewalls are the first line of defense in network security, controlling incoming and outgoing traffic based on predefined rules. **Stateless firewalls** examine individual packets in isolation, offering a basic level of protection with minimal resource overhead. **Stateful firewalls**, however, maintain context about active connections, enabling them to detect and block suspicious traffic more effectively. This distinction allows organizations to balance performance with robust security based on their specific needs.

---

## Module 6: Wireless and Mobile Networks

### 1. Wireless Link Characteristics

Wireless connections differ significantly from wired ones due to factors like interference, signal attenuation, and physical obstructions. These links are prone to higher error rates and variability in quality, necessitating specialized protocols for error correction and retransmission. Understanding these characteristics is essential for designing reliable wireless systems that can adapt to environmental changes and maintain service quality.

### 2. 802.11 MAC Protocol

The 802.11 MAC protocol underpins Wi-Fi networks by employing techniques like Carrier Sense Multiple Access with Collision Avoidance (CSMA/CA). This method minimizes data collisions by ensuring that devices check for a clear channel before transmitting. Its design is crucial for efficiently managing the shared wireless medium and ensuring that multiple devices can communicate simultaneously without excessive interference.

### 3. Cellular vs. Wireline Networks

Cellular networks are engineered to support users on the move, offering seamless connectivity across wide geographical areas. They incorporate advanced features to handle handoffs between cells, manage interference, and optimize spectrum usage. In contrast, wireline networks, typically providing higher data rates and lower latency, are ideal for fixed locations. The differences in design and functionality highlight the trade-offs between mobility and performance.

### 4. 4G vs. 802.11 MAC

In 4G networks, scheduled access is used to allocate specific time slots or frequency bands to users, enhancing efficiency and reducing collisions in high-density scenarios. This controlled environment contrasts with the contention-based approach of 802.11 MAC in Wi-Fi networks, where devices compete for access to the medium. The scheduled access in 4G results in more predictable performance, which is particularly beneficial in congested environments, while the flexible, albeit less efficient, mechanism of 802.11 is well-suited for less predictable, local wireless communications.

### 5. Indirect Routing for Mobility

Indirect routing addresses the challenge of maintaining connectivity as mobile users change locations. By using mechanisms such as home agents and foreign agents, the network can dynamically forward packets from the user’s original address to their current location. This technique ensures that mobile devices remain reachable regardless of their movement across different networks, thereby providing a seamless user experience even in highly dynamic environments.

---

This detailed breakdown of each concept explains not only the technical underpinnings but also why these mechanisms are critical in building robust, efficient, and secure networks. Whether you’re designing a home network, managing enterprise infrastructure, or developing real-time communication applications, understanding these topics is fundamental to navigating the complex world of modern networking.
