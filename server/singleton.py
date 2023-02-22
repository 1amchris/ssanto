from collections import defaultdict


class Singleton(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super(Singleton, cls).__call__(*args, **kwargs)
        return cls._instances[cls]


class TenantInstance:

    """
    This is a mixin class. It needs to be called first when derived from. Order is important.
    To implement in subclasses:

    DO:
    class Foo(TenantInstance, OtherBaseClass1, OtherBaseClass2, ..., metaclass=TenantSingleton):
        super().__init__(tenant_id, *args, **kwargs)

    DON'T:
    class Foo(OtherBaseClass1, OtherBaseClass2, TenantInstance, ..., metaclass=TenantSingleton):

    """

    def __init__(self, tenant_id, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.tenant_id = tenant_id


class TenantSingleton(type):
    # TODO: we might need some kind of cleaning up if the tenant is deleted
    _instances = defaultdict(dict)

    def __call__(cls: TenantInstance, tenant_id, *args, **kwargs):
        if cls not in cls._instances[tenant_id]:
            cls._instances[tenant_id][cls] = super(TenantSingleton, cls).__call__(tenant_id, *args, **kwargs)
        return cls._instances[tenant_id][cls]
