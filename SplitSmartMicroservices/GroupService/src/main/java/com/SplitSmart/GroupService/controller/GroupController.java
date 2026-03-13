package com.SplitSmart.GroupService.controller;

import com.SplitSmart.GroupService.entity.Group;
import com.SplitSmart.GroupService.entity.GroupMember;
import com.SplitSmart.GroupService.entity.GroupRole;
import com.SplitSmart.GroupService.service.GroupMemberService;
import com.SplitSmart.GroupService.service.GroupService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/groups")
@RequiredArgsConstructor
public class GroupController {

    private final GroupService groupService;
    private final GroupMemberService groupMemberService;

    @PostMapping
    public ResponseEntity<Group> createGroup(@RequestBody GroupRequest request) {
        return ResponseEntity.ok(groupService.createGroup(request.getGroupName(), request.getCreatedBy()));
    }

    @GetMapping("/{groupId}")
    public ResponseEntity<Group> getGroup(@PathVariable UUID groupId) {
        return ResponseEntity.ok(groupService.getGroupById(groupId));
    }

    @PutMapping("/{groupId}")
    public ResponseEntity<Group> updateGroup(@PathVariable UUID groupId, @RequestBody GroupRequest request) {
        return ResponseEntity.ok(groupService.updateGroupInfo(groupId, request.getGroupName()));
    }

    @PostMapping("/{groupId}/members")
    public ResponseEntity<GroupMember> addMember(@PathVariable UUID groupId, @RequestBody MemberRequest request) {
        return ResponseEntity.ok(groupMemberService.addMember(groupId, request.getUserId(), request.getRole()));
    }

    @DeleteMapping("/{groupId}/members/{userId}")
    public ResponseEntity<Void> removeMember(@PathVariable UUID groupId, @PathVariable UUID userId) {
        groupMemberService.removeMember(groupId, userId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{groupId}/members")
    public ResponseEntity<List<GroupMember>> getMembers(@PathVariable UUID groupId) {
        return ResponseEntity.ok(groupMemberService.getMembersByGroupId(groupId));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<GroupMember>> getUserGroups(@PathVariable UUID userId) {
        return ResponseEntity.ok(groupMemberService.getGroupsByUserId(userId));
    }

    @Data
    public static class GroupRequest {
        private String groupName;
        private UUID createdBy;
    }

    @Data
    public static class MemberRequest {
        private UUID userId;
        private GroupRole role;
    }
}
