package com.SplitSmart.GroupService.service;

import com.SplitSmart.GroupService.entity.GroupMember;
import com.SplitSmart.GroupService.entity.GroupRole;
import com.SplitSmart.GroupService.repository.GroupMemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class GroupMemberService {

    private final GroupMemberRepository groupMemberRepository;

    @Transactional
    public GroupMember addMember(UUID groupId, UUID userId, GroupRole role) {
        if (groupMemberRepository.existsByGroupIdAndUserId(groupId, userId)) {
            throw new RuntimeException("User is already a member of this group");
        }

        GroupMember member = GroupMember.builder()
                .groupId(groupId)
                .userId(userId)
                .role(role)
                .build();

        return groupMemberRepository.save(member);
    }

    @Transactional
    public void removeMember(UUID groupId, UUID userId) {
        groupMemberRepository.deleteByGroupIdAndUserId(groupId, userId);
    }

    public List<GroupMember> getMembersByGroupId(UUID groupId) {
        return groupMemberRepository.findByGroupId(groupId);
    }

    public List<GroupMember> getGroupsByUserId(UUID userId) {
        return groupMemberRepository.findByUserId(userId);
    }
}
